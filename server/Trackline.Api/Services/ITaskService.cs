using Trackline.Api.Models;

namespace Trackline.Api.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskItem>> GetTasksAsync();

    Task<TaskItem?> GetTaskAsync(int id);

    Task<TaskItem> CreateTaskAsync(string title);

    Task<TaskItem?> UpdateTaskAsync(
        int id,
        bool completed
    );

    Task<bool> DeleteTaskAsync(int id);
}