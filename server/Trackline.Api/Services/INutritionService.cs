using Trackline.Api.Contracts.Nutrition;

namespace Trackline.Api.Services;

public interface INutritionService
{
    Task<IReadOnlyList<NutritionLogResponse>> GetLogsAsync(
        DateOnly date);

    Task<NutritionDailySummaryResponse> GetDailySummaryAsync(
        DateOnly date);

    Task<IReadOnlyList<NutritionDailySummaryResponse>> GetWeekSummaryAsync(
        DateOnly date);

    Task<NutritionLogResponse> CreateManualLogAsync(
        CreateNutritionLogRequest request);

    Task<NutritionLogResponse?> UpdateLogAsync(
        int id,
        UpdateNutritionLogRequest request);

    Task<bool> DeleteLogAsync(
        int id);

    Task<NutritionTargetResponse?> GetTargetAsync(
        DateOnly date);

    Task<NutritionTargetResponse> SetTargetAsync(
        SetNutritionTargetRequest request);
}