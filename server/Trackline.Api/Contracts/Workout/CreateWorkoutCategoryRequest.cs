using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Contracts.Workout;

public class CreateWorkoutCategoryRequest
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [StringLength(30)]
    public string? Color { get; set; }
}