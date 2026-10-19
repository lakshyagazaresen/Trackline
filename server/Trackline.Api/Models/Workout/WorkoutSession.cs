namespace Trackline.Api.Models.Workout;

public class WorkoutSession
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string UserId { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public DateOnly WorkoutDate { get; set; }

    public string Status { get; set; } = "Planned";

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<WorkoutSessionExercise> Exercises
        { get; set; } = new List<WorkoutSessionExercise>();
}