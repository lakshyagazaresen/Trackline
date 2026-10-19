using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;

namespace Trackline.Api.Services.Workout;

public interface IWorkoutRepeatService
{
    Task<WorkoutSession> RepeatSessionAsync(
        Guid sourceSessionId,
        CreateWorkoutSessionRequest request
    );
}
