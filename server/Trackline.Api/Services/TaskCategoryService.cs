using Microsoft.EntityFrameworkCore;
using Trackline.Api.Data;
using Trackline.Api.Models;

namespace Trackline.Api.Services;

public class TaskCategoryService
    : ITaskCategoryService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public TaskCategoryService(
        TracklineDbContext context,
        ICurrentUserService currentUserService
    )
    {
        _context = context;
        _currentUserService =
            currentUserService;
    }

    public async Task<IEnumerable<TaskCategory>>
        GetCategoriesAsync()
    {
        var userId =
            _currentUserService.UserId;

        return await _context
            .TaskCategories
            .AsNoTracking()
            .Where(category =>
                category.UserId == userId
            )
            .OrderBy(category =>
                category.SortOrder
            )
            .ThenBy(category =>
                category.Name
            )
            .ToListAsync();
    }

    public async Task<TaskCategory?>
        GetCategoryAsync(int id)
    {
        var userId =
            _currentUserService.UserId;

        return await _context
            .TaskCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(
                category =>
                    category.Id == id &&
                    category.UserId == userId
            );
    }

    public async Task<TaskCategory>
        CreateCategoryAsync(
            CreateTaskCategoryRequest request
        )
    {
        var userId =
            _currentUserService.UserId;

        var name =
            request.Name.Trim();

        var alreadyExists =
            await _context
                .TaskCategories
                .AnyAsync(category =>
                    category.UserId == userId &&
                    category.Name.ToLower() ==
                        name.ToLower()
                );

        if (alreadyExists)
        {
            throw new InvalidOperationException(
                "A category with that name already exists."
            );
        }

        var nextSortOrder =
            await _context
                .TaskCategories
                .Where(category =>
                    category.UserId == userId
                )
                .Select(category =>
                    (int?)category.SortOrder
                )
                .MaxAsync() ?? -1;

        var now =
            DateTimeOffset.UtcNow;

        var category =
            new TaskCategory
            {
                UserId = userId,
                Name = name,
                Color = request.Color,
                SortOrder =
                    nextSortOrder + 1,
                CreatedAt = now,
                UpdatedAt = now
            };

        _context.TaskCategories.Add(
            category
        );

        await _context
            .SaveChangesAsync();

        return category;
    }

    public async Task<TaskCategory?>
        UpdateCategoryAsync(
            int id,
            UpdateTaskCategoryRequest request
        )
    {
        var userId =
            _currentUserService.UserId;

        var category =
            await _context
                .TaskCategories
                .FirstOrDefaultAsync(
                    category =>
                        category.Id == id &&
                        category.UserId == userId
                );

        if (category is null)
        {
            return null;
        }

        var name =
            request.Name.Trim();

        var duplicateExists =
            await _context
                .TaskCategories
                .AnyAsync(other =>
                    other.UserId == userId &&
                    other.Id != id &&
                    other.Name.ToLower() ==
                        name.ToLower()
                );

        if (duplicateExists)
        {
            throw new InvalidOperationException(
                "A category with that name already exists."
            );
        }

        category.Name = name;
        category.Color = request.Color;
        category.SortOrder =
            request.SortOrder;
        category.UpdatedAt =
            DateTimeOffset.UtcNow;

        await _context
            .SaveChangesAsync();

        return category;
    }

    public async Task<bool>
        DeleteCategoryAsync(int id)
    {
        var userId =
            _currentUserService.UserId;

        var category =
            await _context
                .TaskCategories
                .FirstOrDefaultAsync(
                    category =>
                        category.Id == id &&
                        category.UserId == userId
                );

        if (category is null)
        {
            return false;
        }

        _context.TaskCategories.Remove(
            category
        );

        await _context
            .SaveChangesAsync();

        return true;
    }
}