using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chatly.Migrations
{
    /// <inheritdoc />
    public partial class ChatTypeAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Chat",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Chat");
        }
    }
}
