using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Contracts.Workout;

public class CreateWorkoutSessionRequest
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateOnly? WorkoutDate { get; set; }

    public string? Notes { get; set; }
}