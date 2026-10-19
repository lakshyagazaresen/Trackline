using Microsoft.EntityFrameworkCore;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Data;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services;

namespace Trackline.Api.Services.Workout;

/// <summary>
/// Clones a previous workout into a NEW planned session.
/// Preset sets retain reps/weight/type but are never marked completed.
/// The new session stays Planned until a user actually logs a set.
/// </summary>
public sealed class WorkoutRepeatService : IWorkoutRepeatService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public WorkoutRepeatService(
        TracklineDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<WorkoutSession> RepeatSessionAsync(
        Guid sourceSessionId,
        CreateWorkoutSessionRequest request)
    {
        var userId = _currentUserService.UserId;
        var source = await _context.WorkoutSessions
            .AsNoTracking()
            .AsSplitQuery()
            .Include(s => s.Exercises)
                .ThenInclude(e => e.WorkoutCategory)
            .Include(s => s.Exercises)
                .ThenInclude(e => e.Sets)
            .FirstOrDefaultAsync(s =>
                s.Id == sourceSessionId && s.UserId == userId);

        if (source is null)
            throw new KeyNotFoundException("Workout session not found.");

        var name = request.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Workout name is required.");
        if (!request.WorkoutDate.HasValue)
            throw new ArgumentException("Workout date is required.");

        // Archived library exercises cannot be used in a new session.
        var originalExercises = source.Exercises
            .Where(e => !e.WorkoutCategory.IsArchived)
            .OrderBy(e => e.SortOrder)
            .ToList();

        if (originalExercises.Count == 0)
            throw new InvalidOperationException(
                "This workout has no active library exercises to repeat.");

        var now = DateTime.UtcNow;
        var copy = new WorkoutSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = name,
            WorkoutDate = request.WorkoutDate.Value,
            Notes = string.IsNullOrWhiteSpace(request.Notes)
                ? source.Notes : request.Notes.Trim(),
            Status = "Planned",
            StartedAt = null,
            CompletedAt = null,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.WorkoutSessions.Add(copy);

        for (var index = 0; index < originalExercises.Count; index++)
        {
            var previousExercise = originalExercises[index];
            var copiedExercise = new WorkoutSessionExercise
            {
                Id = Guid.NewGuid(),
                WorkoutSessionId = copy.Id,
                WorkoutCategoryId = previousExercise.WorkoutCategoryId,
                SortOrder = index,
                Notes = previousExercise.Notes,
                CreatedAt = now
            };
            _context.WorkoutSessionExercises.Add(copiedExercise);

            foreach (var previousSet in previousExercise.Sets.OrderBy(s => s.SetNumber))
            {
                _context.WorkoutSets.Add(new WorkoutSet
                {
                    Id = Guid.NewGuid(),
                    WorkoutSessionExerciseId = copiedExercise.Id,
                    SetNumber = previousSet.SetNumber,
                    Reps = previousSet.Reps,
                    WeightKg = previousSet.WeightKg,
                    SetType = previousSet.SetType,
                    IsCompleted = false,
                    CompletedAt = null,
                    Notes = previousSet.Notes
                });
            }
        }

        // EF Core saves the clone and all children atomically.
        await _context.SaveChangesAsync();
        return copy;
    }
}
