using Microsoft.EntityFrameworkCore;
using Trackline.Api.Data;
using Trackline.Api.Models;

namespace Trackline.Api.Services;

public class TaskService : ITaskService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public TaskService(
        TracklineDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<TaskItem>> GetTasksAsync()
    {
        var userId = _currentUserService.UserId;

        return await _context.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId)
            .OrderBy(task => task.Id)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetTaskAsync(int id)
    {
        var userId = _currentUserService.UserId;

        return await _context.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(
                task =>
                    task.Id == id &&
                    task.UserId == userId
            );
    }

    public async Task<TaskItem> CreateTaskAsync(
        string title)
    {
        var userId = _currentUserService.UserId;

        var task = new TaskItem
        {
            Title = title,
            Completed = false,
            UserId = userId
        };

        _context.Tasks.Add(task);

        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(
        int id,
        bool completed)
    {
        var userId = _currentUserService.UserId;

        var task = await _context.Tasks
            .FirstOrDefaultAsync(
                task =>
                    task.Id == id &&
                    task.UserId == userId
            );

        if (task is null)
        {
            return null;
        }

        task.Completed = completed;

        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var userId = _currentUserService.UserId;

        var task = await _context.Tasks
            .FirstOrDefaultAsync(
                task =>
                    task.Id == id &&
                    task.UserId == userId
            );

        if (task is null)
        {
            return false;
        }

        _context.Tasks.Remove(task);

        await _context.SaveChangesAsync();

        return true;
    }
}