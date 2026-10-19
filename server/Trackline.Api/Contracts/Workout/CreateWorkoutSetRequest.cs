using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Contracts.Workout;

public class CreateWorkoutSetRequest
{
    [Range(1, int.MaxValue)]
    public int? SetNumber { get; set; }

    [Range(0, int.MaxValue)]
    public int? Reps { get; set; }

    [Range(typeof(decimal), "0", "999999.99")]
    public decimal? WeightKg { get; set; }

    public string SetType { get; set; } = "Normal";

    public bool IsCompleted { get; set; } = false;

    public string? Notes { get; set; }
}