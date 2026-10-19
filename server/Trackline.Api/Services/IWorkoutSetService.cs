
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;

namespace Trackline.Api.Services.Workout;

public interface IWorkoutSetService
{
    Task<IReadOnlyList<WorkoutSet>?>
        GetSetsAsync(
            Guid sessionId,
            Guid exerciseId
        );

    Task<WorkoutSet?>
        GetSetAsync(
            Guid sessionId,
            Guid exerciseId,
            Guid setId
        );

    Task<WorkoutSet>
        CreateSetAsync(
            Guid sessionId,
            Guid exerciseId,
            CreateWorkoutSetRequest request
        );

    Task<WorkoutSet?>
        UpdateSetAsync(
            Guid sessionId,
            Guid exerciseId,
            Guid setId,
            UpdateWorkoutSetRequest request
        );

    Task<bool>
        DeleteSetAsync(
            Guid sessionId,
            Guid exerciseId,
            Guid setId
        );
}
