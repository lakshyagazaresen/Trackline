using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Contracts.Nutrition;

public class SetNutritionTargetRequest
{
    [Range(typeof(decimal), "1", "100000")]
    public decimal DailyCaloriesKcal { get; set; }

    [Range(typeof(decimal), "0", "10000")]
    public decimal? DailyProteinGrams { get; set; }

    [Range(typeof(decimal), "0", "10000")]
    public decimal? DailyCarbsGrams { get; set; }

    [Range(typeof(decimal), "0", "10000")]
    public decimal? DailyFatGrams { get; set; }

    public DateOnly EffectiveFrom { get; set; }
}