using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services.Workout;

namespace Trackline.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/workout-sessions/{id:guid}/repeat")]
public sealed class WorkoutRepeatController : ControllerBase
{
    private readonly IWorkoutRepeatService _repeatService;

    public WorkoutRepeatController(IWorkoutRepeatService repeatService)
    {
        _repeatService = repeatService;
    }

    [HttpPost]
    public async Task<ActionResult<WorkoutSessionResponse>> Repeat(
        Guid id,
        CreateWorkoutSessionRequest request)
    {
        try
        {
            var session = await _repeatService.RepeatSessionAsync(id, request);
            var response = new WorkoutSessionResponse
            {
                Id = session.Id,
                Name = session.Name,
                WorkoutDate = session.WorkoutDate,
                Status = session.Status,
                Notes = session.Notes,
                StartedAt = session.StartedAt,
                CompletedAt = session.CompletedAt,
                CreatedAt = session.CreatedAt,
                UpdatedAt = session.UpdatedAt
            };

            return CreatedAtAction(
                actionName: "GetSession",
                controllerName: "WorkoutSessions",
                routeValues: new { id = session.Id },
                value: response
            );
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }
}
