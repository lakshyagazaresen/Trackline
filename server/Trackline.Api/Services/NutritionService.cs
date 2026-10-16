using Microsoft.EntityFrameworkCore;

using Trackline.Api.Contracts.Nutrition;
using Trackline.Api.Data;
using Trackline.Api.Models;

namespace Trackline.Api.Services;

public class NutritionService : INutritionService
{
    private readonly TracklineDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public NutritionService(
        TracklineDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<NutritionLogResponse>> GetLogsAsync(
        DateOnly date)
    {
        var userId = GetUserId();

        var logs = await _context
            .NutritionLogs
            .AsNoTracking()
            .Where(log =>
                log.UserId == userId &&
                log.ConsumedDate == date)
            .OrderByDescending(log => log.ConsumedAt)
            .ToListAsync();

        return logs
            .Select(MapLog)
            .ToList();
    }

    public async Task<NutritionDailySummaryResponse> GetDailySummaryAsync(
        DateOnly date)
    {
        var userId = GetUserId();

        var logs = await _context
            .NutritionLogs
            .AsNoTracking()
            .Where(log =>
                log.UserId == userId &&
                log.ConsumedDate == date)
            .ToListAsync();

        var target = await FindTargetAsync(
            userId,
            date);

        return BuildDailySummary(
            date,
            logs,
            target);
    }

    public async Task<IReadOnlyList<NutritionDailySummaryResponse>>
        GetWeekSummaryAsync(
            DateOnly date)
    {
        var userId = GetUserId();

        var weekStart =
            StartOfWeek(date);

        var weekEnd =
            weekStart.AddDays(6);

        var totals = await _context
            .NutritionLogs
            .AsNoTracking()
            .Where(log =>
                log.UserId == userId &&
                log.ConsumedDate >= weekStart &&
                log.ConsumedDate <= weekEnd)
            .GroupBy(log => log.ConsumedDate)
            .Select(group => new
            {
                Date = group.Key,

                CaloriesKcal =
                    group.Sum(
                        log => log.CaloriesKcal),

                CarbsGrams =
                    group.Sum(
                        log => log.CarbsGrams),

                ProteinGrams =
                    group.Sum(
                        log => log.ProteinGrams),

                FatGrams =
                    group.Sum(
                        log => log.FatGrams)
            })
            .ToListAsync();

        /*
         * Load all targets that could
         * overlap this week.
         */
        var targets = await _context
            .NutritionTargets
            .AsNoTracking()
            .Where(target =>
                target.UserId == userId &&
                target.EffectiveFrom <= weekEnd &&
                (
                    target.EffectiveTo == null ||
                    target.EffectiveTo >= weekStart
                ))
            .OrderBy(target =>
                target.EffectiveFrom)
            .ToListAsync();

        var result =
            new List<NutritionDailySummaryResponse>();

        for (var dayIndex = 0;
             dayIndex < 7;
             dayIndex++)
        {
            var currentDate =
                weekStart.AddDays(
                    dayIndex);

            var dailyTotal =
                totals.FirstOrDefault(
                    total =>
                        total.Date ==
                        currentDate);

            var target =
                targets
                    .Where(target =>
                        target.EffectiveFrom <=
                            currentDate &&
                        (
                            target.EffectiveTo == null ||
                            target.EffectiveTo >=
                                currentDate
                        ))
                    .OrderByDescending(
                        target =>
                            target.EffectiveFrom)
                    .FirstOrDefault();

            result.Add(
                new NutritionDailySummaryResponse
                {
                    Date = currentDate,

                    CaloriesKcal =
                        dailyTotal?.CaloriesKcal ??
                        0,

                    CarbsGrams =
                        dailyTotal?.CarbsGrams ??
                        0,

                    ProteinGrams =
                        dailyTotal?.ProteinGrams ??
                        0,

                    FatGrams =
                        dailyTotal?.FatGrams ??
                        0,

                    TargetCaloriesKcal =
                        target?.DailyCaloriesKcal,

                    TargetCarbsGrams =
                        target?.DailyCarbsGrams,

                    TargetProteinGrams =
                        target?.DailyProteinGrams,

                    TargetFatGrams =
                        target?.DailyFatGrams
                });
        }

        return result;
    }

    public async Task<NutritionLogResponse> CreateManualLogAsync(
        CreateNutritionLogRequest request)
    {
        var userId = GetUserId();

        if (request.ConsumedAt == default)
        {
            throw new InvalidOperationException(
                "Consumed date and time are required.");
        }

        var now =
            DateTimeOffset.UtcNow;

        var foodName =
            request.FoodName.Trim();

        if (string.IsNullOrWhiteSpace(
            foodName))
        {
            throw new InvalidOperationException(
                "Food name is required.");
        }

        var consumedDate =
    GetConsumedDate(
        request.ConsumedAt);

var consumedAtUtc =
    request.ConsumedAt
        .ToUniversalTime();

        var log =
    new NutritionLog
    {
        UserId = userId,

        FoodName = foodName,

        CaloriesKcal =
            request.CaloriesKcal,

        CarbsGrams =
            request.CarbsGrams,

        ProteinGrams =
            request.ProteinGrams,

        FatGrams =
            request.FatGrams,

        ConsumedDate =
            consumedDate,

        ConsumedAt =
            consumedAtUtc,

        InputMethod =
            NutritionInputMethod.Manual,

        CreatedAt = now,
        UpdatedAt = now
    };
        _context
            .NutritionLogs
            .Add(log);

        await _context
            .SaveChangesAsync();

        return MapLog(log);
    }

    public async Task<NutritionLogResponse?> UpdateLogAsync(
        int id,
        UpdateNutritionLogRequest request)
    {
        var userId = GetUserId();

        var log = await _context
            .NutritionLogs
            .FirstOrDefaultAsync(
                log =>
                    log.Id == id &&
                    log.UserId == userId);

        if (log is null)
        {
            return null;
        }

        if (request.ConsumedAt == default)
        {
            throw new InvalidOperationException(
                "Consumed date and time are required.");
        }

        var foodName =
            request.FoodName.Trim();

        if (string.IsNullOrWhiteSpace(
            foodName))
        {
            throw new InvalidOperationException(
                "Food name is required.");
        }

        log.FoodName =
            foodName;

        log.CaloriesKcal =
            request.CaloriesKcal;

        log.CarbsGrams =
            request.CarbsGrams;

        log.ProteinGrams =
            request.ProteinGrams;

        log.FatGrams =
            request.FatGrams;

        var consumedDate =
    GetConsumedDate(
        request.ConsumedAt);

var consumedAtUtc =
    request.ConsumedAt
        .ToUniversalTime();

log.ConsumedDate =
    consumedDate;

log.ConsumedAt =
    consumedAtUtc;

        log.UpdatedAt =
            DateTimeOffset.UtcNow;

        /*
         * Deliberately leave:
         *
         * InputMethod
         * BarcodeValue
         * AiPrompt
         * AiResponseJson
         * AiModel
         * ImageReference
         *
         * unchanged.
         *
         * This means correcting an AI
         * entry doesn't destroy its
         * original source metadata.
         */

        await _context
            .SaveChangesAsync();

        return MapLog(log);
    }

    public async Task<bool> DeleteLogAsync(
        int id)
    {
        var userId = GetUserId();

        var log = await _context
            .NutritionLogs
            .FirstOrDefaultAsync(
                log =>
                    log.Id == id &&
                    log.UserId == userId);

        if (log is null)
        {
            return false;
        }

        _context
            .NutritionLogs
            .Remove(log);

        await _context
            .SaveChangesAsync();

        return true;
    }

    public async Task<NutritionTargetResponse?> GetTargetAsync(
        DateOnly date)
    {
        var userId = GetUserId();

        var target =
            await FindTargetAsync(
                userId,
                date);

        if (target is null)
        {
            return null;
        }

        return MapTarget(
            target);
    }

    public async Task<NutritionTargetResponse> SetTargetAsync(
        SetNutritionTargetRequest request)
    {
        var userId = GetUserId();

        var now =
            DateTimeOffset.UtcNow;

        /*
         * Is there already a target
         * beginning on exactly this date?
         *
         * If yes, we're editing that
         * target rather than creating
         * another overlapping row.
         */
        var existingTarget =
            await _context
                .NutritionTargets
                .FirstOrDefaultAsync(
                    target =>
                        target.UserId ==
                            userId &&
                        target.EffectiveFrom ==
                            request.EffectiveFrom);

        if (existingTarget is not null)
        {
            existingTarget
                .DailyCaloriesKcal =
                    request.DailyCaloriesKcal;

            existingTarget
                .DailyProteinGrams =
                    request.DailyProteinGrams;

            existingTarget
                .DailyCarbsGrams =
                    request.DailyCarbsGrams;

            existingTarget
                .DailyFatGrams =
                    request.DailyFatGrams;

            existingTarget.UpdatedAt =
                now;

            await _context
                .SaveChangesAsync();

            return MapTarget(
                existingTarget);
        }

        /*
         * Find the target that currently
         * covers the new effective date.
         *
         * Example:
         *
         * 2200 kcal
         * Jan 1 -> null
         *
         * New target starts Mar 1.
         *
         * Old target becomes:
         * Jan 1 -> Feb 28.
         */
        var previousTarget =
            await _context
                .NutritionTargets
                .Where(target =>
                    target.UserId ==
                        userId &&
                    target.EffectiveFrom <
                        request.EffectiveFrom &&
                    (
                        target.EffectiveTo ==
                            null ||
                        target.EffectiveTo >=
                            request.EffectiveFrom
                    ))
                .OrderByDescending(
                    target =>
                        target.EffectiveFrom)
                .FirstOrDefaultAsync();

        if (previousTarget is not null)
        {
            previousTarget.EffectiveTo =
                request
                    .EffectiveFrom
                    .AddDays(-1);

            previousTarget.UpdatedAt =
                now;
        }

        /*
         * There may already be a future
         * scheduled target.
         *
         * Example:
         *
         * New target:
         * Mar 1
         *
         * Existing future target:
         * Jun 1
         *
         * New target should therefore
         * finish on May 31.
         */
        var nextTarget =
            await _context
                .NutritionTargets
                .Where(target =>
                    target.UserId ==
                        userId &&
                    target.EffectiveFrom >
                        request.EffectiveFrom)
                .OrderBy(
                    target =>
                        target.EffectiveFrom)
                .FirstOrDefaultAsync();

        var newTarget =
            new NutritionTarget
            {
                UserId = userId,

                DailyCaloriesKcal =
                    request.DailyCaloriesKcal,

                DailyProteinGrams =
                    request.DailyProteinGrams,

                DailyCarbsGrams =
                    request.DailyCarbsGrams,

                DailyFatGrams =
                    request.DailyFatGrams,

                EffectiveFrom =
                    request.EffectiveFrom,

                EffectiveTo =
                    nextTarget is null
                        ? null
                        : nextTarget
                            .EffectiveFrom
                            .AddDays(-1),

                CreatedAt = now,
                UpdatedAt = now
            };

        _context
            .NutritionTargets
            .Add(newTarget);

        await _context
            .SaveChangesAsync();

        return MapTarget(
            newTarget);
    }

    /*
     * --------------------------------------------------
     * Private helpers
     * --------------------------------------------------
     */

    private string GetUserId()
    {
        return _currentUserService.UserId;
    }

    private async Task<NutritionTarget?>
        FindTargetAsync(
            string userId,
            DateOnly date)
    {
        return await _context
            .NutritionTargets
            .AsNoTracking()
            .Where(target =>
                target.UserId ==
                    userId &&
                target.EffectiveFrom <=
                    date &&
                (
                    target.EffectiveTo ==
                        null ||
                    target.EffectiveTo >=
                        date
                ))
            .OrderByDescending(
                target =>
                    target.EffectiveFrom)
            .FirstOrDefaultAsync();
    }

    private static DateOnly GetConsumedDate(
        DateTimeOffset consumedAt)
    {
        /*
         * Preserve the date from the
         * offset supplied by the client.
         *
         * Example:
         *
         * 2026-10-15T23:30:00+01:00
         *
         * should remain Oct 15 for the
         * user's nutrition diary.
         */
        return DateOnly.FromDateTime(
            consumedAt.DateTime);
    }

    private static DateOnly StartOfWeek(
        DateOnly date)
    {
        var difference =
            date.DayOfWeek ==
                DayOfWeek.Sunday
                ? -6
                : DayOfWeek.Monday -
                    date.DayOfWeek;

        return date.AddDays(
            difference);
    }

    private static NutritionDailySummaryResponse
        BuildDailySummary(
            DateOnly date,
            IEnumerable<NutritionLog> logs,
            NutritionTarget? target)
    {
        return new NutritionDailySummaryResponse
        {
            Date = date,

            CaloriesKcal =
                logs.Sum(
                    log =>
                        log.CaloriesKcal),

            CarbsGrams =
                logs.Sum(
                    log =>
                        log.CarbsGrams),

            ProteinGrams =
                logs.Sum(
                    log =>
                        log.ProteinGrams),

            FatGrams =
                logs.Sum(
                    log =>
                        log.FatGrams),

            TargetCaloriesKcal =
                target?.DailyCaloriesKcal,

            TargetCarbsGrams =
                target?.DailyCarbsGrams,

            TargetProteinGrams =
                target?.DailyProteinGrams,

            TargetFatGrams =
                target?.DailyFatGrams
        };
    }

    private static NutritionLogResponse MapLog(
        NutritionLog log)
    {
        return new NutritionLogResponse
        {
            Id = log.Id,

            FoodName =
                log.FoodName,

            CaloriesKcal =
                log.CaloriesKcal,

            CarbsGrams =
                log.CarbsGrams,

            ProteinGrams =
                log.ProteinGrams,

            FatGrams =
                log.FatGrams,

            ConsumedDate =
                log.ConsumedDate,

            ConsumedAt =
                log.ConsumedAt,

            InputMethod =
                log.InputMethod,

            CreatedAt =
                log.CreatedAt,

            UpdatedAt =
                log.UpdatedAt
        };
    }

    private static NutritionTargetResponse MapTarget(
        NutritionTarget target)
    {
        return new NutritionTargetResponse
        {
            Id =
                target.Id,

            DailyCaloriesKcal =
                target.DailyCaloriesKcal,

            DailyProteinGrams =
                target.DailyProteinGrams,

            DailyCarbsGrams =
                target.DailyCarbsGrams,

            DailyFatGrams =
                target.DailyFatGrams,

            EffectiveFrom =
                target.EffectiveFrom,

            EffectiveTo =
                target.EffectiveTo
        };
    }
}