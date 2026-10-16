using Trackline.Api.Models;

namespace Trackline.Api.Contracts.Nutrition;

public class NutritionLogResponse
{
    public int Id { get; set; }

    public string FoodName { get; set; }
        = string.Empty;

    public decimal CaloriesKcal { get; set; }

    public decimal CarbsGrams { get; set; }

    public decimal ProteinGrams { get; set; }

    public decimal FatGrams { get; set; }

    public DateOnly ConsumedDate { get; set; }

    public DateTimeOffset ConsumedAt { get; set; }

    public NutritionInputMethod InputMethod { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}