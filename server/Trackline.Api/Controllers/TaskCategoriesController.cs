using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Models;
using Trackline.Api.Services;

namespace Trackline.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/task-categories")]
public class TaskCategoriesController : ControllerBase
{
    private readonly ITaskCategoryService _categoryService;

    public TaskCategoriesController(
        ITaskCategoryService categoryService
    )
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskCategory>>>
        GetCategories()
    {
        var categories =
            await _categoryService.GetCategoriesAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskCategory>>
        GetCategory(int id)
    {
        var category =
            await _categoryService.GetCategoryAsync(id);

        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<TaskCategory>>
        CreateCategory(
            CreateTaskCategoryRequest request
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
                category
            );
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskCategory>>
        UpdateCategory(
            int id,
            UpdateTaskCategoryRequest request
        )
    {
        try
        {
            var category =
                await _categoryService
                    .UpdateCategoryAsync(
                        id,
                        request
                    );

            if (category is null)
            {
                return NotFound();
            }

            return Ok(category);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult>
        DeleteCategory(int id)
    {
        var deleted =
            await _categoryService
                .DeleteCategoryAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}