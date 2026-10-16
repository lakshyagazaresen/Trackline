using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Models;

public class NutritionLog
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string UserId { get; set; }
        = string.Empty;

    [MaxLength(200)]
    public string FoodName { get; set; }
        = string.Empty;

    public decimal CaloriesKcal { get; set; }

    public decimal CarbsGrams { get; set; }

    public decimal ProteinGrams { get; set; }

    public decimal FatGrams { get; set; }

    public DateOnly ConsumedDate { get; set; }

    public DateTimeOffset ConsumedAt { get; set; }

    public NutritionInputMethod InputMethod { get; set; }
        = NutritionInputMethod.Manual;

    [MaxLength(200)]
    public string? BarcodeValue { get; set; }

    [MaxLength(2000)]
    public string? AiPrompt { get; set; }

    public string? AiResponseJson { get; set; }

    [MaxLength(200)]
    public string? AiModel { get; set; }

    [MaxLength(1000)]
    public string? ImageReference { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}