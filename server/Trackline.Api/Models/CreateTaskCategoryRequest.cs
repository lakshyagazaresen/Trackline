using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Models;

public class CreateTaskCategoryRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } =
        string.Empty;

    public TaskCategoryColor Color { get; set; } =
        TaskCategoryColor.Slate;
}