using Microsoft.EntityFrameworkCore;
using Trackline.Api.Data;
using Trackline.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("TracklineFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var connectionString =
    builder.Configuration.GetConnectionString(
        "TracklineDatabase"
    )
    ?? throw new InvalidOperationException(
        "Connection string 'TracklineDatabase' not found."
    );

builder.Services.AddDbContext<TracklineDbContext>(
    options =>
        options.UseNpgsql(connectionString)
);

builder.Services.AddScoped<ITaskService, TaskService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("TracklineFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();