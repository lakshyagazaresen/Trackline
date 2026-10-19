using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Contracts.Workout;

public class CreateWorkoutSessionExerciseRequest
{
    [Required]
    public Guid? WorkoutCategoryId { get; set; }

    [Range(0, int.MaxValue)]
    public int? SortOrder { get; set; }

    public string? Notes { get; set; }
}