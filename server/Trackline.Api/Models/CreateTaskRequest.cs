using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Models;

public class CreateTaskRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
}