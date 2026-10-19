namespace Trackline.Api.Contracts.Workout;

public class WorkoutSessionResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateOnly WorkoutDate { get; set; }

    public string Status { get; set; } = "Planned";

    public string? Notes { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}