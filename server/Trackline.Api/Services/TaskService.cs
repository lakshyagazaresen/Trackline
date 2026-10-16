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
            .FirstOrDefaultAsync(task =>
                task.Id == id &&
                task.UserId == userId
            );
    }

    public async Task<TaskItem> CreateTaskAsync(
        CreateTaskRequest request)
    {
        var userId = _currentUserService.UserId;
        await ValidateCategoryAsync(
            request.CategoryId,
            userId
            );
        var now = DateTimeOffset.UtcNow;

        var task = new TaskItem
        {
            UserId = userId,

            Title = request.Title.Trim(),

            Description =
                string.IsNullOrWhiteSpace(request.Description)
                    ? null
                    : request.Description.Trim(),

            Status = TaskItemStatus.Todo,

            Priority = request.Priority,

            CategoryId = request.CategoryId,

            DueDate = request.DueDate,

            CreatedAt = now,
            UpdatedAt = now,

            CompletedAt = null
        };

        _context.Tasks.Add(task);

        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(
        int id,
        UpdateTaskRequest request)
    {
        var userId = _currentUserService.UserId;

        var task = await _context.Tasks
            .FirstOrDefaultAsync(task =>
                task.Id == id &&
                task.UserId == userId
            );

        if (task is null)
        {
            return null;
        }

        await ValidateCategoryAsync(
            request.CategoryId,
            userId
        );

        var now = DateTimeOffset.UtcNow;
        var previousStatus = task.Status;

        task.Title = request.Title.Trim();

        task.Description =
            string.IsNullOrWhiteSpace(request.Description)
                ? null
                : request.Description.Trim();

        task.Status = request.Status;
        task.Priority = request.Priority;
        task.CategoryId =
            request.CategoryId;
        task.DueDate = request.DueDate;
        task.UpdatedAt = now;

        if (
            request.Status == TaskItemStatus.Completed &&
            previousStatus != TaskItemStatus.Completed
        )
        {
            task.CompletedAt = now;
        }
        else if (
            request.Status != TaskItemStatus.Completed
        )
        {
            task.CompletedAt = null;
        }

        await _context.SaveChangesAsync();

        return task;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var userId = _currentUserService.UserId;

        var task = await _context.Tasks
            .FirstOrDefaultAsync(task =>
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
    private async Task ValidateCategoryAsync(
    int? categoryId,
    string userId
)
{
    if (categoryId is null)
    {
        return;
    }

    var categoryExists =
        await _context
            .TaskCategories
            .AnyAsync(category =>
                category.Id == categoryId &&
                category.UserId == userId
            );

    if (!categoryExists)
    {
        throw new InvalidOperationException(
            "The selected category is not available."
        );
    }
}
}