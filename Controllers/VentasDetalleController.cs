using VentaProductos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace VentaProductos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VentasDetalleController : ControllerBase
    {
        private readonly Context _context;

        public VentasDetalleController(Context context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<List<VentaDetalle>>> GetVentasDetalle(int id)
        {
            var ventaDetalle = await _context.VentasDetalle.Include(x => x.Producto).Where(x => x.VentaId == id).ToListAsync();
            if (ventaDetalle == null)
            {
                return NotFound();
            }

            return ventaDetalle;
        }

        [HttpPost]
        public async Task<ActionResult<VentaDetalle>> PostVentasDetalle(VentaDetalle detalleVenta)
        {
            _context.VentasDetalle.Add(detalleVenta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVentasDetalle", new { id = detalleVenta.Id }, detalleVenta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVentasDetalle(int id, VentaDetalle ventaDetalle)
        {
            if (id != ventaDetalle.Id)
            {
                return BadRequest();
            }

            _context.Entry(ventaDetalle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VentaDetalleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();


        }
        private bool VentaDetalleExists(int id)
        {
            return _context.VentasDetalle.Any(e => e.Id == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVentasDetalle(int id)
        {
            var ventaDetalle = await _context.VentasDetalle.FindAsync(id);

            if (ventaDetalle == null)
            {
                return NotFound();
            }

            _context.VentasDetalle.Remove(ventaDetalle);
            await _context.SaveChangesAsync();


            return NoContent();
        }
    }
}