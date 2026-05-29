using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chatly.Migrations
{
    /// <inheritdoc />
    public partial class Changes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPrivate",
                table: "Chat");

            migrationBuilder.AddColumn<int>(
                name: "ChatPrivacy",
                table: "Chat",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChatPrivacy",
                table: "Chat");

            migrationBuilder.AddColumn<bool>(
                name: "IsPrivate",
                table: "Chat",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
