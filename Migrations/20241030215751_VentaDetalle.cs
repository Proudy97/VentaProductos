using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VentaProductos.Migrations
{
    /// <inheritdoc />
    public partial class VentaDetalle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_VentasDetalle_ProductoId",
                table: "VentasDetalle",
                column: "ProductoId");

            migrationBuilder.CreateIndex(
                name: "IX_VentasDetalle_VentaId",
                table: "VentasDetalle",
                column: "VentaId");

            migrationBuilder.AddForeignKey(
                name: "FK_VentasDetalle_Productos_ProductoId",
                table: "VentasDetalle",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VentasDetalle_Venta_VentaId",
                table: "VentasDetalle",
                column: "VentaId",
                principalTable: "Venta",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VentasDetalle_Productos_ProductoId",
                table: "VentasDetalle");

            migrationBuilder.DropForeignKey(
                name: "FK_VentasDetalle_Venta_VentaId",
                table: "VentasDetalle");

            migrationBuilder.DropIndex(
                name: "IX_VentasDetalle_ProductoId",
                table: "VentasDetalle");

            migrationBuilder.DropIndex(
                name: "IX_VentasDetalle_VentaId",
                table: "VentasDetalle");
        }
    }
}
