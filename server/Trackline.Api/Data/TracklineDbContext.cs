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

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>()
            .HasIndex(task => task.UserId);
    }
}