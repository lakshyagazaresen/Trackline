
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Data;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services;

namespace Trackline.Api.Services.Workout;

public class WorkoutSetService : IWorkoutSetService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public WorkoutSetService(
        TracklineDbContext context,
        ICurrentUserService currentUserService
    )
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    // GET OWNED SESSION EXERCISE

    private async Task<WorkoutSessionExercise?>
        GetOwnedSessionExerciseAsync(
            Guid sessionId,
            Guid exerciseId
        )
    {
        var userId = _currentUserService.UserId;

        return await _context.WorkoutSessionExercises
            .Include(entry => entry.WorkoutSession)
            .FirstOrDefaultAsync(entry =>
                entry.Id == exerciseId &&
                entry.WorkoutSessionId == sessionId &&
                entry.WorkoutSession.UserId == userId
            );
    }

    // ENSURE WORKOUT IS EDITABLE

    private static void EnsureEditable(
        WorkoutSession session
    )
    {
        if (session.Status == "Completed")
        {
            throw new InvalidOperationException(
                "This workout is completed. Reopen it before editing sets."
            );
        }

        if (session.Status != "Planned" &&
            session.Status != "InProgress")
        {
            throw new InvalidOperationException(
                "The workout is not in an editable state."
            );
        }
    }

    // GET ALL SETS

    public async Task<IReadOnlyList<WorkoutSet>?>
        GetSetsAsync(
            Guid sessionId,
            Guid exerciseId
        )
    {
        var entry = await GetOwnedSessionExerciseAsync(
            sessionId,
            exerciseId
        );

        if (entry is null)
        {
            return null;
        }

        return await _context.WorkoutSets
            .AsNoTracking()
            .Where(set =>
                set.WorkoutSessionExerciseId == exerciseId
            )
            .OrderBy(set => set.SetNumber)
            .ToListAsync();
    }

    // GET SET BY ID

    public async Task<WorkoutSet?>
        GetSetAsync(
            Guid sessionId,
            Guid exerciseId,
            Guid setId
        )
    {
        var userId = _currentUserService.UserId;

        return await _context.WorkoutSets
            .AsNoTracking()
            .FirstOrDefaultAsync(set =>
                set.Id == setId &&
                set.WorkoutSessionExerciseId == exerciseId &&
                set.SessionExercise.WorkoutSessionId == sessionId &&
                set.SessionExercise.WorkoutSession.UserId == userId
            );
    }

    // CREATE SET AND AUTOMATICALLY START WORKOUT

    public async Task<WorkoutSet> CreateSetAsync(
        Guid sessionId,
        Guid exerciseId,
        CreateWorkoutSetRequest request
    )
    {
        var entry = await GetOwnedSessionExerciseAsync(
            sessionId,
            exerciseId
        );

        if (entry is null)
        {
            throw new KeyNotFoundException(
                "Workout session exercise not found."
            );
        }

        var session = entry.WorkoutSession;

        EnsureEditable(session);

        var setType = NormalizeSetType(request.SetType);

        ValidateValues(
            request.Reps,
            request.WeightKg
        );

        if (request.SetNumber.HasValue &&
            request.SetNumber.Value <= 0)
        {
            throw new ArgumentException(
                "Set number must be positive."
            );
        }

        int setNumber;

        if (request.SetNumber.HasValue)
        {
            setNumber = request.SetNumber.Value;
        }
        else
        {
            var lastNumber = await _context.WorkoutSets
                .Where(set =>
                    set.WorkoutSessionExerciseId == exerciseId
                )
                .MaxAsync(set => (int?)set.SetNumber) ?? 0;

            if (lastNumber == int.MaxValue)
            {
                throw new ArgumentException(
                    "Set number limit reached."
                );
            }

            setNumber = lastNumber + 1;
        }

        var duplicateExists = await _context.WorkoutSets
            .AnyAsync(set =>
                set.WorkoutSessionExerciseId == exerciseId &&
                set.SetNumber == setNumber
            );

        if (duplicateExists)
        {
            throw new InvalidOperationException(
                "Set number already exists."
            );
        }

        var now = DateTime.UtcNow;

        var set = new WorkoutSet
        {
            WorkoutSessionExerciseId = exerciseId,
            SetNumber = setNumber,
            Reps = request.Reps,
            WeightKg = request.WeightKg,
            SetType = setType,
            IsCompleted = request.IsCompleted,
            CompletedAt = request.IsCompleted ? now : null,
            Notes = NormalizeNotes(request.Notes)
        };

        _context.WorkoutSets.Add(set);

        // START WORKOUT WHEN THE FIRST SET IS ADDED

        if (session.Status == "Planned")
        {
            session.Status = "InProgress";
            session.StartedAt ??= now;
            session.UpdatedAt = now;
        }
        else if (session.StartedAt is null)
        {
            // Repair older in-progress sessions
            // that do not have a start timestamp.
            session.StartedAt = now;
            session.UpdatedAt = now;
        }

        // Save the set and session status together.

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException exception)
            when (
                exception.InnerException is PostgresException pgException &&
                pgException.SqlState ==
                    PostgresErrorCodes.UniqueViolation
            )
        {
            throw new InvalidOperationException(
                "Set number already exists. Please retry.",
                exception
            );
        }

        return set;
    }

    // UPDATE SET

    public async Task<WorkoutSet?> UpdateSetAsync(
        Guid sessionId,
        Guid exerciseId,
        Guid setId,
        UpdateWorkoutSetRequest request
    )
    {
        var userId = _currentUserService.UserId;

        var set = await _context.WorkoutSets
            .Include(item => item.SessionExercise)
            .ThenInclude(entry => entry.WorkoutSession)
            .FirstOrDefaultAsync(item =>
                item.Id == setId &&
                item.WorkoutSessionExerciseId == exerciseId &&
                item.SessionExercise.WorkoutSessionId == sessionId &&
                item.SessionExercise.WorkoutSession.UserId == userId
            );

        if (set is null)
        {
            return null;
        }

        EnsureEditable(set.SessionExercise.WorkoutSession);

        var setType = NormalizeSetType(request.SetType);

        ValidateValues(
            request.Reps,
            request.WeightKg
        );

        var now = DateTime.UtcNow;

        if (request.IsCompleted)
        {
            if (!set.IsCompleted || set.CompletedAt is null)
            {
                set.CompletedAt = now;
            }
        }
        else
        {
            set.CompletedAt = null;
        }

        set.Reps = request.Reps;
        set.WeightKg = request.WeightKg;
        set.SetType = setType;
        set.IsCompleted = request.IsCompleted;
        set.Notes = NormalizeNotes(request.Notes);

        await _context.SaveChangesAsync();

        return set;
    }

    // DELETE SET

    public async Task<bool> DeleteSetAsync(
        Guid sessionId,
        Guid exerciseId,
        Guid setId
    )
    {
        var userId = _currentUserService.UserId;

        var set = await _context.WorkoutSets
            .Include(item => item.SessionExercise)
            .ThenInclude(entry => entry.WorkoutSession)
            .FirstOrDefaultAsync(item =>
                item.Id == setId &&
                item.WorkoutSessionExerciseId == exerciseId &&
                item.SessionExercise.WorkoutSessionId == sessionId &&
                item.SessionExercise.WorkoutSession.UserId == userId
            );

        if (set is null)
        {
            return false;
        }

        EnsureEditable(set.SessionExercise.WorkoutSession);

        _context.WorkoutSets.Remove(set);

        await _context.SaveChangesAsync();

        return true;
    }

    // HELPERS

    private static string NormalizeSetType(string? value)
    {
        var normalized = value?.Trim().ToLowerInvariant();

        return normalized switch
        {
            "normal" => "Normal",
            "warmup" => "Warmup",
            "dropset" => "Dropset",
            _ => throw new ArgumentException(
                "Set type must be Normal, Warmup or Dropset."
            )
        };
    }

    private static void ValidateValues(
        int? reps,
        decimal? weightKg
    )
    {
        if (reps < 0)
        {
            throw new ArgumentException(
                "Repetitions cannot be negative."
            );
        }

        if (weightKg < 0 || weightKg > 999999.99m)
        {
            throw new ArgumentException(
                "Weight must be between 0 and 999999.99 kg."
            );
        }

        if (weightKg.HasValue &&
            decimal.Round(weightKg.Value, 2) != weightKg.Value)
        {
            throw new ArgumentException(
                "Weight must have at most two decimal places."
            );
        }
    }

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes)
            ? null
            : notes.Trim();
    }
}
