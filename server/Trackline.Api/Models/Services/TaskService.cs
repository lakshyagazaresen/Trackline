using Microsoft.EntityFrameworkCore;
using Trackline.Api.Data;
using Trackline.Api.Models;

namespace Trackline.Api.Services;

public class TaskService : ITaskService
{
    private readonly TracklineDbContext _db;

    public TaskService(TracklineDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<TaskItem>> GetTasksAsync()
    {
        return await _db.Tasks
            .AsNoTracking()
            .OrderBy(task => task.Id)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetTaskAsync(int id)
    {
        return await _db.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(
                task => task.Id == id
            );
    }

    public async Task<TaskItem> CreateTaskAsync(
        string title)
    {
        var task = new TaskItem
        {
            Title = title.Trim(),
            Completed = false
        };

        _db.Tasks.Add(task);

        await _db.SaveChangesAsync();

        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(
        int id,
        bool completed)
    {
        var task = await _db.Tasks.FindAsync(id);

        if (task is null)
        {
            return null;
        }

        task.Completed = completed;

        await _db.SaveChangesAsync();

        return task;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _db.Tasks.FindAsync(id);

        if (task is null)
        {
            return false;
        }

        _db.Tasks.Remove(task);

        await _db.SaveChangesAsync();

        return true;
    }
}