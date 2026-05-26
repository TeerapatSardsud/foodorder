using FoodOrderApi.Data;
using FoodOrderApi.DTOs;
using FoodOrderApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodOrderApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    public OrdersController(AppDbContext db) => _db = db;

    // GET /api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponse>>> GetAll()
    {
        var orders = await _db.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items).ThenInclude(i => i.MenuItem)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(MapToResponse));
    }

    // GET /api/orders/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetById(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items).ThenInclude(i => i.MenuItem)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();
        return Ok(MapToResponse(order));
    }

    // POST /api/orders
    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create([FromBody] CreateOrderRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Description))
            return BadRequest(new { error = "Description is required." });

        var customer = await _db.Users.FindAsync(request.CustomerId);
        if (customer == null)
            return BadRequest(new { error = "Customer not found." });

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}",
            Description = request.Description,
            OrderType   = request.OrderType,
            CustomerId  = request.CustomerId,
            CreatedAt   = DateTime.UtcNow
        };

        foreach (var item in request.Items)
        {
            var menuItem = await _db.MenuItems.FindAsync(item.MenuItemId);
            if (menuItem == null) continue;

            order.Items.Add(new OrderItem
            {
                MenuItemId = item.MenuItemId,
                Quantity   = item.Quantity,
                UnitPrice  = menuItem.Price
            });
            order.TotalAmount += menuItem.Price * item.Quantity;
        }

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        await _db.Entry(order).Reference(o => o.Customer).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, MapToResponse(order));
    }

    // PUT /api/orders/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<OrderResponse>> Update(int id, [FromBody] UpdateOrderRequest request)
    {
        var order = await _db.Orders
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();

        if (string.IsNullOrWhiteSpace(request.Description))
            return BadRequest(new { error = "Description is required." });

        order.Description = request.Description;
        order.Status      = request.Status;
        order.OrderType   = request.OrderType;

        await _db.SaveChangesAsync();
        return Ok(MapToResponse(order));
    }

    // DELETE /api/orders/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static OrderResponse MapToResponse(Order o) => new()
    {
        Id           = o.Id,
        OrderNumber  = o.OrderNumber,
        Description  = o.Description,
        Status       = o.Status.ToString(),
        OrderType    = o.OrderType.ToString(),
        TotalAmount  = o.TotalAmount,
        CustomerId   = o.CustomerId,
        CustomerName = o.Customer?.FullName ?? "",
        CreatedAt    = o.CreatedAt,
        Items        = o.Items.Select(i => new OrderItemResponse
        {
            MenuItemId   = i.MenuItemId,
            MenuItemName = i.MenuItem?.Name ?? "",
            Quantity     = i.Quantity,
            UnitPrice    = i.UnitPrice
        }).ToList()
    };
}
