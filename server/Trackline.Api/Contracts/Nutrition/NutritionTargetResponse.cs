namespace Trackline.Api.Contracts.Nutrition;

public class NutritionTargetResponse
{
    public int Id { get; set; }

    public decimal DailyCaloriesKcal { get; set; }

    public decimal? DailyProteinGrams { get; set; }

    public decimal? DailyCarbsGrams { get; set; }

    public decimal? DailyFatGrams { get; set; }

    public DateOnly EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }
}