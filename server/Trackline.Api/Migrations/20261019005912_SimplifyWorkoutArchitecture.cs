using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Trackline.Api.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyWorkoutArchitecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutSessionExercises_WorkoutExercises_WorkoutExerciseId",
                table: "WorkoutSessionExercises");

            migrationBuilder.DropTable(
                name: "WorkoutExercises");

            migrationBuilder.DropIndex(
                name: "IX_WorkoutSessionExercises_WorkoutSessionId_SortOrder",
                table: "WorkoutSessionExercises");

            migrationBuilder.RenameColumn(
                name: "WorkoutExerciseId",
                table: "WorkoutSessionExercises",
                newName: "WorkoutCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkoutSessionExercises_WorkoutExerciseId",
                table: "WorkoutSessionExercises",
                newName: "IX_WorkoutSessionExercises_WorkoutCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutSessionExercises_WorkoutSessionId_SortOrder",
                table: "WorkoutSessionExercises",
                columns: new[] { "WorkoutSessionId", "SortOrder" },
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_WorkoutSessionExercises_SortOrder",
                table: "WorkoutSessionExercises",
                sql: "\"SortOrder\" >= 0");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutSessionExercises_WorkoutCategories_WorkoutCategoryId",
                table: "WorkoutSessionExercises",
                column: "WorkoutCategoryId",
                principalTable: "WorkoutCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkoutSessionExercises_WorkoutCategories_WorkoutCategoryId",
                table: "WorkoutSessionExercises");

            migrationBuilder.DropIndex(
                name: "IX_WorkoutSessionExercises_WorkoutSessionId_SortOrder",
                table: "WorkoutSessionExercises");

            migrationBuilder.DropCheckConstraint(
                name: "CK_WorkoutSessionExercises_SortOrder",
                table: "WorkoutSessionExercises");

            migrationBuilder.RenameColumn(
                name: "WorkoutCategoryId",
                table: "WorkoutSessionExercises",
                newName: "WorkoutExerciseId");

            migrationBuilder.RenameIndex(
                name: "IX_WorkoutSessionExercises_WorkoutCategoryId",
                table: "WorkoutSessionExercises",
                newName: "IX_WorkoutSessionExercises_WorkoutExerciseId");

            migrationBuilder.CreateTable(
                name: "WorkoutExercises",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkoutCategoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkoutExercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkoutExercises_WorkoutCategories_WorkoutCategoryId",
                        column: x => x.WorkoutCategoryId,
                        principalTable: "WorkoutCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutSessionExercises_WorkoutSessionId_SortOrder",
                table: "WorkoutSessionExercises",
                columns: new[] { "WorkoutSessionId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutExercises_UserId_Name",
                table: "WorkoutExercises",
                columns: new[] { "UserId", "Name" },
                unique: true,
                filter: "\"IsArchived\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutExercises_WorkoutCategoryId",
                table: "WorkoutExercises",
                column: "WorkoutCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkoutSessionExercises_WorkoutExercises_WorkoutExerciseId",
                table: "WorkoutSessionExercises",
                column: "WorkoutExerciseId",
                principalTable: "WorkoutExercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
