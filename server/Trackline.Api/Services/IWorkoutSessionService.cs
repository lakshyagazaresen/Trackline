
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;

namespace Trackline.Api.Services.Workout;

public interface IWorkoutSessionService
{
    // GET ALL SESSIONS
    Task<IEnumerable<WorkoutSession>>
        GetSessionsAsync();

    // GET SESSION
    Task<WorkoutSession?>
        GetSessionAsync(Guid id);

    // CREATE SESSION
    Task<WorkoutSession>
        CreateSessionAsync(
            CreateWorkoutSessionRequest request
        );

    // UPDATE SESSION
    Task<WorkoutSession?>
        UpdateSessionAsync(
            Guid id,
            UpdateWorkoutSessionRequest request
        );

    // FINISH WORKOUT
    Task<WorkoutSession?>
        FinishSessionAsync(Guid id);

    // REOPEN COMPLETED WORKOUT
    Task<WorkoutSession?>
        ReopenSessionAsync(Guid id);

    // DELETE SESSION
    Task<bool>
        DeleteSessionAsync(Guid id);
}
