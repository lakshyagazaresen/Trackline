using System.ComponentModel.DataAnnotations;

namespace Trackline.Api.Contracts.Nutrition;

public class UpdateNutritionLogRequest
{
    [Required]
    [StringLength(200)]
    public string FoodName { get; set; }
        = string.Empty;

    [Range(typeof(decimal), "0", "100000")]
    public decimal CaloriesKcal { get; set; }

    [Range(typeof(decimal), "0", "10000")]
    public decimal CarbsGrams { get; set; }

    [Range(typeof(decimal), "0", "10000")]
    public decimal ProteinGrams { get; set; }

    [Range(typeof(decimal), "0", "10000")]
    public decimal FatGrams { get; set; }

    public DateTimeOffset ConsumedAt { get; set; }
}