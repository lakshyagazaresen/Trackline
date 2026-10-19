
using Microsoft.EntityFrameworkCore;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Data;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services;

namespace Trackline.Api.Services.Workout;

public class WorkoutSessionService
    : IWorkoutSessionService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public WorkoutSessionService(
        TracklineDbContext context,
        ICurrentUserService currentUserService
    )
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    // GET ALL WORKOUT SESSIONS

    public async Task<IEnumerable<WorkoutSession>>
        GetSessionsAsync()
    {
        var userId = _currentUserService.UserId;

        return await _context
            .WorkoutSessions
            .AsNoTracking()
            .Where(session =>
                session.UserId == userId
            )
            .OrderByDescending(session =>
                session.WorkoutDate
            )
            .ThenByDescending(session =>
                session.CreatedAt
            )
            .ToListAsync();
    }

    // GET WORKOUT SESSION BY ID

    public async Task<WorkoutSession?>
        GetSessionAsync(Guid id)
    {
        var userId = _currentUserService.UserId;

        return await _context
            .WorkoutSessions
            .AsNoTracking()
            .FirstOrDefaultAsync(session =>
                session.Id == id &&
                session.UserId == userId
            );
    }

    // CREATE WORKOUT SESSION

    public async Task<WorkoutSession>
        CreateSessionAsync(
            CreateWorkoutSessionRequest request
        )
    {
        var userId = _currentUserService.UserId;

        var name = request.Name?.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Workout name is required."
            );
        }

        if (!request.WorkoutDate.HasValue)
        {
            throw new ArgumentException(
                "Workout date is required."
            );
        }

        var now = DateTime.UtcNow;

        var session = new WorkoutSession
        {
            UserId = userId,
            Name = name,
            WorkoutDate = request.WorkoutDate.Value,
            Notes = NormalizeNotes(request.Notes),
            Status = "Planned",
            StartedAt = null,
            CompletedAt = null,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.WorkoutSessions.Add(session);

        await _context.SaveChangesAsync();

        return session;
    }

    // UPDATE WORKOUT SESSION

    public async Task<WorkoutSession?>
        UpdateSessionAsync(
            Guid id,
            UpdateWorkoutSessionRequest request
        )
    {
        var userId = _currentUserService.UserId;

        var session = await _context
            .WorkoutSessions
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId
            );

        if (session is null)
        {
            return null;
        }

        if (session.Status == "Completed")
        {
            throw new InvalidOperationException(
                "This workout is completed. Reopen it before editing."
            );
        }

        var name = request.Name?.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Workout name is required."
            );
        }

        if (!request.WorkoutDate.HasValue)
        {
            throw new ArgumentException(
                "Workout date is required."
            );
        }

        session.Name = name;
        session.WorkoutDate = request.WorkoutDate.Value;
        session.Notes = NormalizeNotes(request.Notes);
        session.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return session;
    }

    // FINISH WORKOUT

    public async Task<WorkoutSession?>
        FinishSessionAsync(Guid id)
    {
        var userId = _currentUserService.UserId;

        var session = await _context
            .WorkoutSessions
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId
            );

        if (session is null)
        {
            return null;
        }

        if (session.Status == "Completed")
        {
            throw new InvalidOperationException(
                "This workout is already completed."
            );
        }

        // Require at least one completed set.
        // Other sets may remain unfinished.

        var hasCompletedSet = await _context
            .WorkoutSets
            .AnyAsync(set =>
                set.SessionExercise.WorkoutSessionId == id &&
                set.IsCompleted
            );

        if (!hasCompletedSet)
        {
            throw new InvalidOperationException(
                "Complete at least one set before finishing the workout."
            );
        }

        var now = DateTime.UtcNow;

        // Fallback for sessions created before
        // automatic workout starting was implemented.
        session.StartedAt ??= now;

        session.Status = "Completed";
        session.CompletedAt = now;
        session.UpdatedAt = now;

        await _context.SaveChangesAsync();

        return session;
    }

    // REOPEN COMPLETED WORKOUT

    public async Task<WorkoutSession?>
        ReopenSessionAsync(Guid id)
    {
        var userId = _currentUserService.UserId;

        var session = await _context
            .WorkoutSessions
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId
            );

        if (session is null)
        {
            return null;
        }

        if (session.Status != "Completed")
        {
            throw new InvalidOperationException(
                "Only completed workouts can be reopened."
            );
        }

        var now = DateTime.UtcNow;

        session.Status = "InProgress";

        // Preserve the original workout start time.
        session.StartedAt ??= now;

        // Clear the completion time because
        // the session is active again.
        session.CompletedAt = null;
        session.UpdatedAt = now;

        await _context.SaveChangesAsync();

        return session;
    }

    // DELETE WORKOUT SESSION

    public async Task<bool>
        DeleteSessionAsync(Guid id)
    {
        var userId = _currentUserService.UserId;

        var session = await _context
            .WorkoutSessions
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId
            );

        if (session is null)
        {
            return false;
        }

        _context.WorkoutSessions.Remove(session);

        await _context.SaveChangesAsync();

        return true;
    }

    // HELPERS

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes)
            ? null
            : notes.Trim();
    }
}
