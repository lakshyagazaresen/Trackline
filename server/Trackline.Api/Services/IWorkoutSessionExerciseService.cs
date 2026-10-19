
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;

namespace Trackline.Api.Services.Workout;

public interface IWorkoutSessionExerciseService
{
    Task<IReadOnlyList<WorkoutSessionExercise>?>
        GetExercisesAsync(Guid sessionId);

    Task<WorkoutSessionExercise?>
        GetExerciseAsync(
            Guid sessionId,
            Guid id
        );

    Task<WorkoutSessionExercise>
        AddExerciseAsync(
            Guid sessionId,
            CreateWorkoutSessionExerciseRequest request
        );

    Task<WorkoutSessionExercise?>
        UpdateExerciseAsync(
            Guid sessionId,
            Guid id,
            UpdateWorkoutSessionExerciseRequest request
        );

    Task<bool>
        RemoveExerciseAsync(
            Guid sessionId,
            Guid id
        );
}
