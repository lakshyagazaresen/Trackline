
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services.Workout;

namespace Trackline.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/workout-sessions")]
public class WorkoutSessionsController : ControllerBase
{
    private readonly IWorkoutSessionService _sessionService;

    public WorkoutSessionsController(
        IWorkoutSessionService sessionService
    )
    {
        _sessionService = sessionService;
    }

    // CONVERT ENTITY TO RESPONSE

    private static WorkoutSessionResponse ToResponse(
        WorkoutSession session
    )
    {
        return new WorkoutSessionResponse
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
    }

    // GET ALL WORKOUT SESSIONS

    [HttpGet]
    public async Task<ActionResult<
        IEnumerable<WorkoutSessionResponse>>>
        GetSessions()
    {
        var sessions =
            await _sessionService.GetSessionsAsync();

        return Ok(sessions.Select(ToResponse));
    }

    // GET SESSION BY ID

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WorkoutSessionResponse>>
        GetSession(Guid id)
    {
        var session =
            await _sessionService.GetSessionAsync(id);

        if (session is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(session));
    }

    // CREATE SESSION

    [HttpPost]
    public async Task<ActionResult<WorkoutSessionResponse>>
        CreateSession(
            CreateWorkoutSessionRequest request
        )
    {
        try
        {
            var session =
                await _sessionService.CreateSessionAsync(request);

            return CreatedAtAction(
                nameof(GetSession),
                new { id = session.Id },
                ToResponse(session)
            );
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }

    // UPDATE SESSION

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<WorkoutSessionResponse>>
        UpdateSession(
            Guid id,
            UpdateWorkoutSessionRequest request
        )
    {
        try
        {
            var session =
                await _sessionService.UpdateSessionAsync(
                    id,
                    request
                );

            if (session is null)
            {
                return NotFound();
            }

            return Ok(ToResponse(session));
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

    // FINISH WORKOUT

    [HttpPost("{id:guid}/finish")]
    public async Task<ActionResult<WorkoutSessionResponse>>
        FinishSession(Guid id)
    {
        try
        {
            var session =
                await _sessionService.FinishSessionAsync(id);

            if (session is null)
            {
                return NotFound();
            }

            return Ok(ToResponse(session));
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    // REOPEN WORKOUT

    [HttpPost("{id:guid}/reopen")]
    public async Task<ActionResult<WorkoutSessionResponse>>
        ReopenSession(Guid id)
    {
        try
        {
            var session =
                await _sessionService.ReopenSessionAsync(id);

            if (session is null)
            {
                return NotFound();
            }

            return Ok(ToResponse(session));
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    // DELETE SESSION

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult>
        DeleteSession(Guid id)
    {
        var deleted =
            await _sessionService.DeleteSessionAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
