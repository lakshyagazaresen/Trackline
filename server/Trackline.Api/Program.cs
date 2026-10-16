using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Trackline.Api.Data;
using System.Text.Json.Serialization;
using Trackline.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions
            .Converters
            .Add(new JsonStringEnumConverter());
    });
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("TracklineFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://proud-hill-005b2cd0f.1.azurestaticapps.net"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var connectionString =
    builder.Configuration.GetConnectionString("TracklineDatabase")
    ?? throw new InvalidOperationException(
        "Connection string 'TracklineDatabase' not found."
    );

builder.Services.AddDbContext<TracklineDbContext>(
    options => options.UseNpgsql(connectionString)
);

builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<
    ITaskCategoryService,
    TaskCategoryService
>();
builder.Services.AddScoped<
    INutritionService,
    NutritionService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(
        builder.Configuration.GetSection("AzureAd")
    );

builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<
    ICurrentUserService,
    CurrentUserService
>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("TracklineFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();