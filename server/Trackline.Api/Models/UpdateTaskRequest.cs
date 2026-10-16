using System.ComponentModel.DataAnnotations;
using Trackline.Api.Models.Common;

namespace Trackline.Api.Models;

public class UpdateTaskRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(4000)]
    public string? Description { get; set; }

    public TaskItemStatus Status { get; set; }

    public Priority Priority { get; set; }
    public int? CategoryId { get; set; }

    public DateOnly? DueDate { get; set; }
}