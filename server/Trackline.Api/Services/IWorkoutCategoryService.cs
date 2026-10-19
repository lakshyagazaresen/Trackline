
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;

namespace Trackline.Api.Services.Workout;

public interface IWorkoutCategoryService
{
    Task<IEnumerable<WorkoutCategory>>
        GetCategoriesAsync();

    Task<WorkoutCategory?>
        GetCategoryAsync(Guid id);

    Task<WorkoutCategory>
        CreateCategoryAsync(
            CreateWorkoutCategoryRequest request
        );

    Task<WorkoutCategory?>
        UpdateCategoryAsync(
            Guid id,
            UpdateWorkoutCategoryRequest request
        );

    Task<bool>
        ArchiveCategoryAsync(Guid id);
}
