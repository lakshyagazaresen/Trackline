
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trackline.Api.Contracts.Workout;
using Trackline.Api.Models.Workout;
using Trackline.Api.Services.Workout;

namespace Trackline.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/workout-sessions/{sessionId:guid}/exercises")]
public class WorkoutSessionExercisesController : ControllerBase
{
    private readonly IWorkoutSessionExerciseService
        _exerciseService;

    public WorkoutSessionExercisesController(
        IWorkoutSessionExerciseService exerciseService
    )
    {
        _exerciseService = exerciseService;
    }

    // CONVERT ENTITY TO API RESPONSE

    private static WorkoutSessionExerciseResponse
        ToResponse(WorkoutSessionExercise entry)
    {
        return new WorkoutSessionExerciseResponse
        {
            Id = entry.Id,
            WorkoutSessionId = entry.WorkoutSessionId,
            WorkoutCategoryId = entry.WorkoutCategoryId,
            ExerciseName = entry.WorkoutCategory.Name,
            ExerciseColor = entry.WorkoutCategory.Color,
            SortOrder = entry.SortOrder,
            Notes = entry.Notes
        };
    }

    // GET ALL EXERCISES

    [HttpGet]
    public async Task<IActionResult>
        GetExercises(Guid sessionId)
    {
        var exercises = await _exerciseService
            .GetExercisesAsync(sessionId);

        if (exercises is null)
        {
            return NotFound();
        }

        return Ok(exercises.Select(ToResponse));
    }

    // GET EXERCISE BY ID

    [HttpGet("{id:guid}")]
    public async Task<IActionResult>
        GetExercise(Guid sessionId, Guid id)
    {
        var exercise = await _exerciseService
            .GetExerciseAsync(sessionId, id);

        if (exercise is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(exercise));
    }

    // ADD EXERCISE

    [HttpPost]
    public async Task<IActionResult>
        AddExercise(
            Guid sessionId,
            CreateWorkoutSessionExerciseRequest request
        )
    {
        try
        {
            var exercise = await _exerciseService
                .AddExerciseAsync(sessionId, request);

            return CreatedAtAction(
                nameof(GetExercise),
                new
                {
                    sessionId,
                    id = exercise.Id
                },
                ToResponse(exercise)
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

    // UPDATE EXERCISE

    [HttpPut("{id:guid}")]
    public async Task<IActionResult>
        UpdateExercise(
            Guid sessionId,
            Guid id,
            UpdateWorkoutSessionExerciseRequest request
        )
    {
        try
        {
            var exercise = await _exerciseService
                .UpdateExerciseAsync(
                    sessionId,
                    id,
                    request
                );

            if (exercise is null)
            {
                return NotFound();
            }

            return Ok(ToResponse(exercise));
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

    // REMOVE EXERCISE

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult>
        RemoveExercise(
            Guid sessionId,
            Guid id
        )
    {
        try
        {
            var removed = await _exerciseService
                .RemoveExerciseAsync(sessionId, id);

            if (!removed)
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
