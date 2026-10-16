using Trackline.Api.Models;

namespace Trackline.Api.Services;

public interface ITaskCategoryService
{
    Task<IEnumerable<TaskCategory>>
        GetCategoriesAsync();

    Task<TaskCategory?>
        GetCategoryAsync(int id);

    Task<TaskCategory>
        CreateCategoryAsync(
            CreateTaskCategoryRequest request
        );

    Task<TaskCategory?>
        UpdateCategoryAsync(
            int id,
            UpdateTaskCategoryRequest request
        );

    Task<bool>
        DeleteCategoryAsync(int id);
}