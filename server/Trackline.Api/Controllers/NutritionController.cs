using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Trackline.Api.Contracts.Nutrition;
using Trackline.Api.Services;

namespace Trackline.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/nutrition")]
public class NutritionController : ControllerBase
{
    private readonly INutritionService _nutritionService;

    public NutritionController(
        INutritionService nutritionService)
    {
        _nutritionService = nutritionService;
    }

    /*
     * GET
     * /api/nutrition/logs?date=2026-10-15
     */
    [HttpGet("logs")]
    public async Task<ActionResult<
        IReadOnlyList<NutritionLogResponse>>>
        GetLogs(
            [FromQuery] DateOnly date)
    {
        var logs =
            await _nutritionService
                .GetLogsAsync(date);

        return Ok(logs);
    }

    /*
     * POST
     * /api/nutrition/logs/manual
     */
    [HttpPost("logs/manual")]
    public async Task<ActionResult<
        NutritionLogResponse>>
        CreateManualLog(
            CreateNutritionLogRequest request)
    {
        try
        {
            var log =
                await _nutritionService
                    .CreateManualLogAsync(
                        request);

            return CreatedAtAction(
                nameof(GetLogs),
                new
                {
                    date =
                        log.ConsumedDate
                },
                log);
        }
        catch (
            InvalidOperationException exception)
        {
            return BadRequest(
                new
                {
                    message =
                        exception.Message
                });
        }
    }

    /*
     * PUT
     * /api/nutrition/logs/123
     */
    [HttpPut("logs/{id:int}")]
    public async Task<ActionResult<
        NutritionLogResponse>>
        UpdateLog(
            int id,
            UpdateNutritionLogRequest request)
    {
        try
        {
            var log =
                await _nutritionService
                    .UpdateLogAsync(
                        id,
                        request);

            if (log is null)
            {
                return NotFound();
            }

            return Ok(log);
        }
        catch (
            InvalidOperationException exception)
        {
            return BadRequest(
                new
                {
                    message =
                        exception.Message
                });
        }
    }

    /*
     * DELETE
     * /api/nutrition/logs/123
     */
    [HttpDelete("logs/{id:int}")]
    public async Task<IActionResult>
        DeleteLog(
            int id)
    {
        var deleted =
            await _nutritionService
                .DeleteLogAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    /*
     * GET
     * /api/nutrition/summary?date=2026-10-15
     */
    [HttpGet("summary")]
    public async Task<ActionResult<
        NutritionDailySummaryResponse>>
        GetDailySummary(
            [FromQuery] DateOnly date)
    {
        var summary =
            await _nutritionService
                .GetDailySummaryAsync(
                    date);

        return Ok(summary);
    }

    /*
     * GET
     * /api/nutrition/week?date=2026-10-15
     *
     * The supplied date can be any day
     * within the required week.
     * Service returns Monday -> Sunday.
     */
    [HttpGet("week")]
    public async Task<ActionResult<
        IReadOnlyList<
            NutritionDailySummaryResponse>>>
        GetWeekSummary(
            [FromQuery] DateOnly date)
    {
        var summary =
            await _nutritionService
                .GetWeekSummaryAsync(
                    date);

        return Ok(summary);
    }

    /*
     * GET
     * /api/nutrition/target?date=2026-10-15
     */
    [HttpGet("target")]
    public async Task<ActionResult<
        NutritionTargetResponse>>
        GetTarget(
            [FromQuery] DateOnly date)
    {
        var target =
            await _nutritionService
                .GetTargetAsync(
                    date);

        if (target is null)
        {
            return NotFound();
        }

        return Ok(target);
    }

    /*
     * PUT
     * /api/nutrition/target
     */
    [HttpPut("target")]
    public async Task<ActionResult<
        NutritionTargetResponse>>
        SetTarget(
            SetNutritionTargetRequest request)
    {
        var target =
            await _nutritionService
                .SetTargetAsync(
                    request);

        return Ok(target);
    }
}