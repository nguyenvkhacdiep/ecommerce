using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class AddUrlAvatarToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlAvatar",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlAvatar",
                table: "Users");
        }
    }
}
