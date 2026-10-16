using Microsoft.EntityFrameworkCore;
using Trackline.Api.Models;

namespace Trackline.Api.Data;

public class TracklineDbContext : DbContext
{
    public TracklineDbContext(
        DbContextOptions<TracklineDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks =>
        Set<TaskItem>();
    
    public DbSet<TaskCategory> TaskCategories =>
        Set<TaskCategory>();

    public DbSet<NutritionLog> NutritionLogs
        => Set<NutritionLog>();

    public DbSet<NutritionTarget> NutritionTargets
        => Set<NutritionTarget>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>()
            .HasIndex(task => task.UserId);
        
        modelBuilder.Entity<TaskCategory>()
            .HasIndex(category => new
            {
                category.UserId,
                category.Name
            })
            .IsUnique();

        modelBuilder.Entity<TaskItem>()
            .HasOne(task => task.Category)
            .WithMany(category => category.Tasks)
            .HasForeignKey(task => task.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder
            .Entity<NutritionLog>()
            .HasIndex(log => new
            {
                log.UserId,
                log.ConsumedDate
            });

        modelBuilder
            .Entity<NutritionTarget>()
            .HasIndex(target => new
            {
                target.UserId,
                target.EffectiveFrom
            });

        modelBuilder
            .Entity<NutritionLog>()
            .Property(log => log.AiResponseJson)
            .HasColumnType("jsonb");
        modelBuilder
            .Entity<NutritionLog>()
            .Property(log => log.CaloriesKcal)
            .HasPrecision(10, 2);

        modelBuilder
            .Entity<NutritionLog>()
            .Property(log => log.CarbsGrams)
            .HasPrecision(10, 2);

        modelBuilder
            .Entity<NutritionLog>()
            .Property(log => log.ProteinGrams)
            .HasPrecision(10, 2);

        modelBuilder
            .Entity<NutritionLog>()
            .Property(log => log.FatGrams)
            .HasPrecision(10, 2);

        modelBuilder
            .Entity<NutritionTarget>()
            .Property(target => target.DailyCaloriesKcal)
            .HasPrecision(10, 2);
        
        modelBuilder
            .Entity<NutritionTarget>()
            .Property(target => target.DailyProteinGrams)
            .HasPrecision(10, 2);

        modelBuilder
            .Entity<NutritionTarget>()
            .Property(target => target.DailyCarbsGrams)
            .HasPrecision(10, 2);

        modelBuilder
            .Entity<NutritionTarget>()
            .Property(target => target.DailyFatGrams)
            .HasPrecision(10, 2);
    }
}