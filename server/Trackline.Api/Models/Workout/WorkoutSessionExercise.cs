namespace Trackline.Api.Models.Workout;

public class WorkoutSessionExercise
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid WorkoutSessionId { get; set; }

    public WorkoutSession WorkoutSession { get; set; } = null!;

    public Guid WorkoutCategoryId { get; set; }

    public WorkoutCategory WorkoutCategory { get; set; } = null!;

    public int SortOrder { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<WorkoutSet> Sets { get; set; }
        = new List<WorkoutSet>();
}