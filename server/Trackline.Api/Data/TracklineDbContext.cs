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

    public DbSet<TaskItem> Tasks => Set<TaskItem>();
}