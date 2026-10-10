using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Models;
using Trackline.Api.Services;

namespace Trackline.Api.Controllers;

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
        var tasks =
            await _taskService.GetTasksAsync();

        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(
        int id)
    {
        var task =
            await _taskService.GetTaskAsync(id);

        if (task is null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(
        CreateTaskRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(
                "Task title is required."
            );
        }

        var task =
            await _taskService.CreateTaskAsync(
                request.Title
            );

        return CreatedAtAction(
            nameof(GetTask),
            new { id = task.Id },
            task
        );
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<TaskItem>> UpdateTask(
        int id,
        UpdateTaskRequest request)
    {
        var task =
            await _taskService.UpdateTaskAsync(
                id,
                request.Completed
            );

        if (task is null)
        {
            return NotFound();
        }

        return Ok(task);
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