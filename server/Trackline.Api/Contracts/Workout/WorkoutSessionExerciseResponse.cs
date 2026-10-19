namespace Trackline.Api.Contracts.Workout;

public class WorkoutSessionExerciseResponse
{
    public Guid Id { get; set; }

    public Guid WorkoutSessionId { get; set; }

    public Guid WorkoutCategoryId { get; set; }

    public string ExerciseName { get; set; } = string.Empty;

    public string? ExerciseColor { get; set; }

    public int SortOrder { get; set; }

    public string? Notes { get; set; }
}