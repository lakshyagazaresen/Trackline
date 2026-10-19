using Microsoft.EntityFrameworkCore;
using Trackline.Api.Models;
using Trackline.Api.Models.Workout;

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
    
    public DbSet<WorkoutCategory> WorkoutCategories
        => Set<WorkoutCategory>();


    public DbSet<WorkoutSession> WorkoutSessions
        => Set<WorkoutSession>();

    public DbSet<WorkoutSessionExercise> WorkoutSessionExercises
        => Set<WorkoutSessionExercise>();

    public DbSet<WorkoutSet> WorkoutSets
        => Set<WorkoutSet>();

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

        // WORKOUT CATEGORIES

        modelBuilder.Entity<WorkoutCategory>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
            entity.Property(x => x.Color).HasMaxLength(30);

            entity.HasIndex(x => new
            {
                x.UserId,
                x.Name
            })
            .IsUnique()
            .HasFilter("\"IsArchived\" = false");
        });       

        // WORKOUT SESSIONS

        modelBuilder.Entity<WorkoutSession>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.UserId).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(150).IsRequired();
            entity.Property(x => x.Status)
                .HasMaxLength(20)
                .IsRequired();

            entity.HasIndex(x => new { x.UserId, x.WorkoutDate });
            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_WorkoutSessions_Status",
                    "\"Status\" IN ('Planned', 'InProgress', 'Completed')");
            });
        });

        // WORKOUT SESSION EXERCISES

        modelBuilder.Entity<WorkoutSessionExercise>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasOne(x => x.WorkoutSession)
                .WithMany(x => x.Exercises)
                .HasForeignKey(x => x.WorkoutSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.WorkoutCategory)
                .WithMany(x => x.SessionExercises)
                .HasForeignKey(x => x.WorkoutCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(x => new
            {
                x.WorkoutSessionId,
                x.SortOrder
            })
            .IsUnique();

            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_WorkoutSessionExercises_SortOrder",
                    "\"SortOrder\" >= 0");
            });
        });

        // WORKOUT SETS

        modelBuilder.Entity<WorkoutSet>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.WeightKg)
                .HasPrecision(8, 2);

            entity.Property(x => x.SetType)
                .HasMaxLength(20)
                .IsRequired();

            entity.HasOne(x => x.SessionExercise)
                .WithMany(x => x.Sets)
                .HasForeignKey(x => x.WorkoutSessionExerciseId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(x => new
            {
                x.WorkoutSessionExerciseId,
                x.SetNumber
            }).IsUnique();

            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_WorkoutSets_Reps",
                    "\"Reps\" IS NULL OR \"Reps\" >= 0");

                t.HasCheckConstraint(
                    "CK_WorkoutSets_Weight",
                    "\"WeightKg\" IS NULL OR \"WeightKg\" >= 0");

                t.HasCheckConstraint(
                    "CK_WorkoutSets_SetNumber",
                    "\"SetNumber\" > 0");
            });
        });
    }
}