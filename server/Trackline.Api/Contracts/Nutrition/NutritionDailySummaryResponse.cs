namespace Trackline.Api.Contracts.Nutrition;

public class NutritionDailySummaryResponse
{
    public DateOnly Date { get; set; }

    public decimal CaloriesKcal { get; set; }

    public decimal CarbsGrams { get; set; }

    public decimal ProteinGrams { get; set; }

    public decimal FatGrams { get; set; }

    public decimal? TargetCaloriesKcal { get; set; }

    public decimal? TargetCarbsGrams { get; set; }

    public decimal? TargetProteinGrams { get; set; }

    public decimal? TargetFatGrams { get; set; }
}