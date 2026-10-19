
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Services.Workout;

namespace Trackline.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/workout-categories")]
public class WorkoutCategoriesController : ControllerBase
{
    private readonly IWorkoutCategoryService _categoryService;

    public WorkoutCategoriesController(
        IWorkoutCategoryService categoryService
    )
    {
        _categoryService = categoryService;
    }

    // GET ALL ACTIVE CATEGORIES

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories =
            await _categoryService.GetCategoriesAsync();

        return Ok(categories.Select(category => new
        {
            category.Id,
            category.Name,
            category.Color
        }));
    }

    // GET CATEGORY BY ID

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCategory(Guid id)
    {
        var category =
            await _categoryService.GetCategoryAsync(id);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(new
        {
            category.Id,
            category.Name,
            category.Color
        });
    }

    // CREATE CATEGORY

    [HttpPost]
    public async Task<IActionResult> CreateCategory(
        CreateWorkoutCategoryRequest request
    )
    {
        try
        {
            var category =
                await _categoryService
                    .CreateCategoryAsync(request);

            return CreatedAtAction(
                nameof(GetCategory),
                new { id = category.Id },
                new
                {
                    category.Id,
                    category.Name,
                    category.Color
                }
            );
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    // UPDATE CATEGORY

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCategory(
        Guid id,
        UpdateWorkoutCategoryRequest request
    )
    {
        try
        {
            var category =
                await _categoryService
                    .UpdateCategoryAsync(id, request);

            if (category is null)
            {
                return NotFound();
            }

            return Ok(new
            {
                category.Id,
                category.Name,
                category.Color
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    // ARCHIVE CATEGORY (SOFT DELETE)

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> ArchiveCategory(Guid id)
    {
        var archived =
            await _categoryService
                .ArchiveCategoryAsync(id);

        if (!archived)
        {
            return NotFound();
        }

        return NoContent();
    }
}
