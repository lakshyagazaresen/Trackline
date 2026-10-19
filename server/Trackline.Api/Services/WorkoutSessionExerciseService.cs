
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Data;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services;

namespace Trackline.Api.Services.Workout;

public class WorkoutSessionExerciseService
    : IWorkoutSessionExerciseService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public WorkoutSessionExerciseService(
        TracklineDbContext context,
        ICurrentUserService currentUserService
    )
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    // GET SESSION BELONGING TO CURRENT USER

    private async Task<WorkoutSession?>
        GetOwnedSessionAsync(Guid sessionId)
    {
        var userId = _currentUserService.UserId;

        return await _context.WorkoutSessions
            .FirstOrDefaultAsync(session =>
                session.Id == sessionId &&
                session.UserId == userId
            );
    }

    // ENSURE WORKOUT CAN BE EDITED

    private static void EnsureEditable(
        WorkoutSession session
    )
    {
        if (session.Status == "Completed")
        {
            throw new InvalidOperationException(
                "This workout is completed. Reopen it before editing exercises."
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

    // GET ALL EXERCISES IN SESSION

    public async Task<IReadOnlyList<WorkoutSessionExercise>?>
        GetExercisesAsync(Guid sessionId)
    {
        var session = await GetOwnedSessionAsync(sessionId);

        if (session is null)
        {
            return null;
        }

        return await _context.WorkoutSessionExercises
            .AsNoTracking()
            .Include(entry => entry.WorkoutCategory)
            .Where(entry =>
                entry.WorkoutSessionId == sessionId
            )
            .OrderBy(entry => entry.SortOrder)
            .ToListAsync();
    }

    // GET ONE SESSION EXERCISE

    public async Task<WorkoutSessionExercise?>
        GetExerciseAsync(
            Guid sessionId,
            Guid id
        )
    {
        var userId = _currentUserService.UserId;

        return await _context.WorkoutSessionExercises
            .AsNoTracking()
            .Include(entry => entry.WorkoutCategory)
            .FirstOrDefaultAsync(entry =>
                entry.Id == id &&
                entry.WorkoutSessionId == sessionId &&
                entry.WorkoutSession.UserId == userId
            );
    }

    // ADD EXERCISE TO WORKOUT

    public async Task<WorkoutSessionExercise>
        AddExerciseAsync(
            Guid sessionId,
            CreateWorkoutSessionExerciseRequest request
        )
    {
        var session = await GetOwnedSessionAsync(sessionId);

        if (session is null)
        {
            throw new KeyNotFoundException(
                "Workout session not found."
            );
        }

        EnsureEditable(session);

        if (!request.WorkoutCategoryId.HasValue ||
            request.WorkoutCategoryId.Value == Guid.Empty)
        {
            throw new ArgumentException(
                "Workout category is required."
            );
        }

        var userId = _currentUserService.UserId;

        var category = await _context.WorkoutCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(item =>
                item.Id == request.WorkoutCategoryId.Value &&
                item.UserId == userId &&
                !item.IsArchived
            );

        if (category is null)
        {
            throw new ArgumentException(
                "Invalid or archived workout category."
            );
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var entries =
                await _context.WorkoutSessionExercises
                    .Where(entry =>
                        entry.WorkoutSessionId == sessionId
                    )
                    .OrderBy(entry => entry.SortOrder)
                    .ToListAsync();

            var position =
                request.SortOrder ?? entries.Count;

            if (position < 0 ||
                position > entries.Count)
            {
                throw new ArgumentException(
                    "SortOrder is outside the valid range."
                );
            }

            var entry = new WorkoutSessionExercise
            {
                WorkoutSessionId = sessionId,
                WorkoutCategoryId = category.Id,
                SortOrder = position,
                Notes = NormalizeNotes(request.Notes),
                CreatedAt = DateTime.UtcNow
            };

            entries.Insert(position, entry);

            // Reorder existing exercises safely.
            await RenumberAsync(entries);

            _context.WorkoutSessionExercises.Add(entry);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Load the category for the API response.

            return await _context.WorkoutSessionExercises
                .AsNoTracking()
                .Include(item => item.WorkoutCategory)
                .FirstAsync(item => item.Id == entry.Id);
        }
        catch (DbUpdateException exception)
            when (
                exception.InnerException is PostgresException pgException &&
                pgException.SqlState ==
                    PostgresErrorCodes.UniqueViolation
            )
        {
            throw new InvalidOperationException(
                "Exercise ordering changed. Please retry.",
                exception
            );
        }
    }

    // UPDATE EXERCISE NOTES OR POSITION

    public async Task<WorkoutSessionExercise?>
        UpdateExerciseAsync(
            Guid sessionId,
            Guid id,
            UpdateWorkoutSessionExerciseRequest request
        )
    {
        var session = await GetOwnedSessionAsync(sessionId);

        if (session is null)
        {
            return null;
        }

        EnsureEditable(session);

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var entries =
                await _context.WorkoutSessionExercises
                    .Include(entry => entry.WorkoutCategory)
                    .Where(entry =>
                        entry.WorkoutSessionId == sessionId
                    )
                    .OrderBy(entry => entry.SortOrder)
                    .ToListAsync();

            var entry =
                entries.FirstOrDefault(item => item.Id == id);

            if (entry is null)
            {
                return null;
            }

            if (request.SortOrder < 0 ||
                request.SortOrder >= entries.Count)
            {
                throw new ArgumentException(
                    "SortOrder is outside the valid range."
                );
            }

            entries.Remove(entry);
            entries.Insert(request.SortOrder, entry);

            await RenumberAsync(entries);

            entry.Notes = NormalizeNotes(request.Notes);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return entry;
        }
        catch (DbUpdateException exception)
            when (
                exception.InnerException is PostgresException pgException &&
                pgException.SqlState ==
                    PostgresErrorCodes.UniqueViolation
            )
        {
            throw new InvalidOperationException(
                "Exercise ordering changed. Please retry.",
                exception
            );
        }
    }

    // REMOVE EXERCISE AND ITS SETS

    public async Task<bool>
        RemoveExerciseAsync(
            Guid sessionId,
            Guid id
        )
    {
        var session = await GetOwnedSessionAsync(sessionId);

        if (session is null)
        {
            return false;
        }

        EnsureEditable(session);

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            var entries =
                await _context.WorkoutSessionExercises
                    .Where(entry =>
                        entry.WorkoutSessionId == sessionId
                    )
                    .OrderBy(entry => entry.SortOrder)
                    .ToListAsync();

            var entry =
                entries.FirstOrDefault(item => item.Id == id);

            if (entry is null)
            {
                return false;
            }

            entries.Remove(entry);

            // The existing EF Core cascade relationship
            // also deletes the exercise's sets.

            _context.WorkoutSessionExercises.Remove(entry);

            await _context.SaveChangesAsync();

            // Reorder the remaining exercises.
            await RenumberAsync(entries);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return true;
        }
        catch (DbUpdateException exception)
            when (
                exception.InnerException is PostgresException pgException &&
                pgException.SqlState ==
                    PostgresErrorCodes.UniqueViolation
            )
        {
            throw new InvalidOperationException(
                "Exercise ordering changed. Please retry.",
                exception
            );
        }
    }

    // RENUMBER EXERCISES SAFELY

    private async Task RenumberAsync(
        List<WorkoutSessionExercise> entries
    )
    {
        var existing = entries
            .Where(entry =>
                _context.Entry(entry).State !=
                    EntityState.Detached &&
                _context.Entry(entry).State !=
                    EntityState.Added
            )
            .ToList();

        if (existing.Count > 0)
        {
            var maxPosition =
                existing.Max(entry => entry.SortOrder);

            var temporaryStart = checked(
                maxPosition + entries.Count + 1
            );

            // Move existing records into temporary
            // positions to avoid unique index conflicts.

            for (var i = 0; i < existing.Count; i++)
            {
                existing[i].SortOrder = checked(
                    temporaryStart + i
                );
            }

            await _context.SaveChangesAsync();
        }

        // Assign final sequential positions.

        for (var i = 0; i < entries.Count; i++)
        {
            entries[i].SortOrder = i;
        }
    }

    // NORMALIZE OPTIONAL NOTES

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes)
            ? null
            : notes.Trim();
    }
}
