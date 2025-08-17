using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Repositories.Migrations
{
    /// <inheritdoc />
    public partial class RelationshipShopandCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ShopId",
                table: "CategoryProducts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_CategoryProducts_ShopId",
                table: "CategoryProducts",
                column: "ShopId");

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryProducts_Shops_ShopId",
                table: "CategoryProducts",
                column: "ShopId",
                principalTable: "Shops",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryProducts_Shops_ShopId",
                table: "CategoryProducts");

            migrationBuilder.DropIndex(
                name: "IX_CategoryProducts_ShopId",
                table: "CategoryProducts");

            migrationBuilder.DropColumn(
                name: "ShopId",
                table: "CategoryProducts");
        }
    }
}
