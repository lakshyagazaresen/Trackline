using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Models;

public class NutritionTarget
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string UserId { get; set; }
        = string.Empty;

    public decimal DailyCaloriesKcal { get; set; }

    public decimal? DailyProteinGrams { get; set; }

    public decimal? DailyCarbsGrams { get; set; }

    public decimal? DailyFatGrams { get; set; }

    public DateOnly EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}