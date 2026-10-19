
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services.Workout;

namespace Trackline.Api.Controllers;

[Authorize]
[ApiController]
[Route(
    "api/workout-sessions/{sessionId:guid}/exercises/{exerciseId:guid}/sets"
)]
public class WorkoutSetsController : ControllerBase
{
    private readonly IWorkoutSetService _setService;

    public WorkoutSetsController(
        IWorkoutSetService setService
    )
    {
        _setService = setService;
    }

    // CONVERT ENTITY TO RESPONSE

    private static WorkoutSetResponse ToResponse(
        WorkoutSet set
    )
    {
        return new WorkoutSetResponse
        {
            Id = set.Id,
            WorkoutSessionExerciseId =
                set.WorkoutSessionExerciseId,
            SetNumber = set.SetNumber,
            Reps = set.Reps,
            WeightKg = set.WeightKg,
            SetType = set.SetType,
            IsCompleted = set.IsCompleted,
            CompletedAt = set.CompletedAt,
            Notes = set.Notes
        };
    }

    // GET ALL SETS

    [HttpGet]
    public async Task<ActionResult<
        IEnumerable<WorkoutSetResponse>>>
        GetSets(
            Guid sessionId,
            Guid exerciseId
        )
    {
        var sets = await _setService.GetSetsAsync(
            sessionId,
            exerciseId
        );

        if (sets is null)
        {
            return NotFound();
        }

        return Ok(sets.Select(ToResponse));
    }

    // GET SET BY ID

    [HttpGet("{setId:guid}")]
    public async Task<ActionResult<WorkoutSetResponse>>
        GetSet(
            Guid sessionId,
            Guid exerciseId,
            Guid setId
        )
    {
        var set = await _setService.GetSetAsync(
            sessionId,
            exerciseId,
            setId
        );

        if (set is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(set));
    }

    // CREATE SET

    [HttpPost]
    public async Task<ActionResult<WorkoutSetResponse>>
        CreateSet(
            Guid sessionId,
            Guid exerciseId,
            CreateWorkoutSetRequest request
        )
    {
        try
        {
            var set = await _setService.CreateSetAsync(
                sessionId,
                exerciseId,
                request
            );

            return CreatedAtAction(
                nameof(GetSet),
                new
                {
                    sessionId,
                    exerciseId,
                    setId = set.Id
                },
                ToResponse(set)
            );
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
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

    // UPDATE SET

    [HttpPut("{setId:guid}")]
    public async Task<ActionResult<WorkoutSetResponse>>
        UpdateSet(
            Guid sessionId,
            Guid exerciseId,
            Guid setId,
            UpdateWorkoutSetRequest request
        )
    {
        try
        {
            var set = await _setService.UpdateSetAsync(
                sessionId,
                exerciseId,
                setId,
                request
            );

            if (set is null)
            {
                return NotFound();
            }

            return Ok(ToResponse(set));
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

    // DELETE SET

    [HttpDelete("{setId:guid}")]
    public async Task<IActionResult> DeleteSet(
        Guid sessionId,
        Guid exerciseId,
        Guid setId
    )
    {
        try
        {
            var deleted = await _setService.DeleteSetAsync(
                sessionId,
                exerciseId,
                setId
            );

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }
}
