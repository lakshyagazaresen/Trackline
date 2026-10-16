using Trackline.Api.Models;

namespace Trackline.Api.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetTasksAsync();

    Task<TaskItem?> GetTaskAsync(int id);

    Task<TaskItem> CreateTaskAsync(
        CreateTaskRequest request
    );

    Task<TaskItem?> UpdateTaskAsync(
        int id,
        UpdateTaskRequest request
    );

    Task<bool> DeleteTaskAsync(int id);
}