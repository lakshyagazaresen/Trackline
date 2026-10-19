
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Data;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services;

namespace Trackline.Api.Services.Workout;

public class WorkoutCategoryService
    : IWorkoutCategoryService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public WorkoutCategoryService(
        TracklineDbContext context,
        ICurrentUserService currentUserService
    )
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    // GET ALL ACTIVE CATEGORIES

    public async Task<IEnumerable<WorkoutCategory>>
        GetCategoriesAsync()
    {
        var userId = _currentUserService.UserId;

        return await _context
            .WorkoutCategories
            .AsNoTracking()
            .Where(category =>
                category.UserId == userId &&
                !category.IsArchived
            )
            .OrderBy(category => category.Name)
            .ToListAsync();
    }

    // GET CATEGORY BY ID

    public async Task<WorkoutCategory?>
        GetCategoryAsync(Guid id)
    {
        var userId = _currentUserService.UserId;

        return await _context
            .WorkoutCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(category =>
                category.Id == id &&
                category.UserId == userId &&
                !category.IsArchived
            );
    }

    // CREATE CATEGORY

    public async Task<WorkoutCategory>
        CreateCategoryAsync(
            CreateWorkoutCategoryRequest request
        )
    {
        var userId = _currentUserService.UserId;

        var name = request.Name?.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Exercise name is required."
            );
        }

        var normalizedName = name.ToLowerInvariant();

        var alreadyExists = await _context
            .WorkoutCategories
            .AnyAsync(category =>
                category.UserId == userId &&
                !category.IsArchived &&
                category.Name.ToLower() == normalizedName
            );

        if (alreadyExists)
        {
            throw new InvalidOperationException(
                "An exercise with that name already exists."
            );
        }

        var now = DateTime.UtcNow;

        var category = new WorkoutCategory
        {
            UserId = userId,
            Name = name,
            Color = NormalizeColor(request.Color),
            IsArchived = false,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.WorkoutCategories.Add(category);

        await SaveChangesHandlingDuplicatesAsync();

        return category;
    }

    // UPDATE CATEGORY

    public async Task<WorkoutCategory?>
        UpdateCategoryAsync(
            Guid id,
            UpdateWorkoutCategoryRequest request
        )
    {
        var userId = _currentUserService.UserId;

        var category = await _context
            .WorkoutCategories
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId &&
                !item.IsArchived
            );

        if (category is null)
        {
            return null;
        }

        var name = request.Name?.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Exercise name is required."
            );
        }

        var normalizedName = name.ToLowerInvariant();

        var duplicateExists = await _context
            .WorkoutCategories
            .AnyAsync(other =>
                other.UserId == userId &&
                other.Id != id &&
                !other.IsArchived &&
                other.Name.ToLower() == normalizedName
            );

        if (duplicateExists)
        {
            throw new InvalidOperationException(
                "An exercise with that name already exists."
            );
        }

        category.Name = name;
        category.Color = NormalizeColor(request.Color);
        category.UpdatedAt = DateTime.UtcNow;

        await SaveChangesHandlingDuplicatesAsync();

        return category;
    }

    // ARCHIVE CATEGORY (SOFT DELETE)

    public async Task<bool>
        ArchiveCategoryAsync(Guid id)
    {
        var userId = _currentUserService.UserId;

        var category = await _context
            .WorkoutCategories
            .FirstOrDefaultAsync(item =>
                item.Id == id &&
                item.UserId == userId &&
                !item.IsArchived
            );

        if (category is null)
        {
            return false;
        }

        category.IsArchived = true;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    // HELPERS

    private static string? NormalizeColor(string? color)
    {
        return string.IsNullOrWhiteSpace(color)
            ? null
            : color.Trim();
    }

    private async Task SaveChangesHandlingDuplicatesAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException exception)
            when (exception.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation
            })
        {
            throw new InvalidOperationException(
                "An exercise with that name already exists.",
                exception
            );
        }
    }
}
