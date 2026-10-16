using System.ComponentModel.DataAnnotations;
using Trackline.Api.Models.Common;

namespace Trackline.Api.Models;

public class TaskItem
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string UserId { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    public TaskItemStatus Status { get; set; }
        = TaskItemStatus.Todo;

    public Priority Priority { get; set; }
        = Priority.Medium;

    public int? CategoryId { get; set; }

    public TaskCategory? Category { get; set; }

    public DateOnly? DueDate { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public DateTimeOffset? CompletedAt { get; set; }


}