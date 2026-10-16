using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Trackline.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNutrition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NutritionLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FoodName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CaloriesKcal = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CarbsGrams = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    ProteinGrams = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    FatGrams = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    ConsumedDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ConsumedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    InputMethod = table.Column<int>(type: "integer", nullable: false),
                    BarcodeValue = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    AiPrompt = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    AiResponseJson = table.Column<string>(type: "jsonb", nullable: true),
                    AiModel = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ImageReference = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NutritionLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NutritionTargets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DailyCaloriesKcal = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    DailyProteinGrams = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    DailyCarbsGrams = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    DailyFatGrams = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: false),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NutritionTargets", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NutritionLogs_UserId_ConsumedDate",
                table: "NutritionLogs",
                columns: new[] { "UserId", "ConsumedDate" });

            migrationBuilder.CreateIndex(
                name: "IX_NutritionTargets_UserId_EffectiveFrom",
                table: "NutritionTargets",
                columns: new[] { "UserId", "EffectiveFrom" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NutritionLogs");

            migrationBuilder.DropTable(
                name: "NutritionTargets");
        }
    }
}
