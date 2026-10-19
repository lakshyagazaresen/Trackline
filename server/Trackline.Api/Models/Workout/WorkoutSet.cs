namespace Trackline.Api.Models.Workout;

public class WorkoutSet
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid WorkoutSessionExerciseId { get; set; }

    public WorkoutSessionExercise SessionExercise
        { get; set; } = null!;

    public int SetNumber { get; set; }

    public int? Reps { get; set; }

    public decimal? WeightKg { get; set; }

    public string SetType { get; set; } = "Normal";

    public bool IsCompleted { get; set; } = false;

    public DateTime? CompletedAt { get; set; }

    public string? Notes { get; set; }
}