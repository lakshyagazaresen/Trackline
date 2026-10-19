namespace Trackline.Api.Contracts.Workout;

public class WorkoutSetResponse
{
    public Guid Id { get; set; }

    public Guid WorkoutSessionExerciseId { get; set; }

    public int SetNumber { get; set; }

    public int? Reps { get; set; }

    public decimal? WeightKg { get; set; }

    public string SetType { get; set; } = "Normal";

    public bool IsCompleted { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? Notes { get; set; }
}