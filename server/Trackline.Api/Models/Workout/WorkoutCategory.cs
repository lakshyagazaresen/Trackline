namespace Trackline.Api.Models.Workout;

public class WorkoutCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string UserId { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Color { get; set; }

    public bool IsArchived { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<WorkoutSessionExercise> SessionExercises
        { get; set; } = new List<WorkoutSessionExercise>();
}