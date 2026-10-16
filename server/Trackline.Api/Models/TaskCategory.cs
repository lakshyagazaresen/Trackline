using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Models;

public class TaskCategory
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string UserId { get; set; } =
        string.Empty;

    [MaxLength(100)]
    public string Name { get; set; } =
        string.Empty;

    public TaskCategoryColor Color { get; set; } =
        TaskCategoryColor.Slate;

    public int SortOrder { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public ICollection<TaskItem> Tasks { get; set; } =
        new List<TaskItem>();
}