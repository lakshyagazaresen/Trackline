using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Models;

public class TaskItem
{
    public int Id { get; set; }

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public bool Completed { get; set; }
}