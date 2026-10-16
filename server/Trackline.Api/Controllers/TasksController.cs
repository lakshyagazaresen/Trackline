using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Models;
using Trackline.Api.Services;

namespace Trackline.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
    {
        var tasks = await _taskService.GetTasksAsync();

        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    {
        var task = await _taskService.GetTaskAsync(id);

        if (task is null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>>
        CreateTask(
            CreateTaskRequest request
        )
    {
        try
        {
            var task =
                await _taskService
                    .CreateTaskAsync(request);

            return CreatedAtAction(
                nameof(GetTask),
                new { id = task.Id },
                task
            );
        }
        catch (
            InvalidOperationException exception
        )
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskItem>>
        UpdateTask(
            int id,
            UpdateTaskRequest request
        )
    {
        try
        {
            var task =
                await _taskService
                    .UpdateTaskAsync(
                        id,
                        request
                    );

            if (task is null)
            {
                return NotFound();
            }

            return Ok(task);
        }
        catch (
            InvalidOperationException exception
        )
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var deleted =
            await _taskService.DeleteTaskAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}