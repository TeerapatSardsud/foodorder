using FoodOrderApi.Data;
using FoodOrderApi.DTOs;
using FoodOrderApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodOrderApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryResponse>> GetSummary()
    {
        var orders = await _db.Orders.ToListAsync();

        var byStatus = orders
            .GroupBy(o => o.Status.ToString())
            .Select(g => new StatusCountDto { Status = g.Key, Count = g.Count() })
            .ToList();

        var byType = orders
            .GroupBy(o => o.OrderType.ToString())
            .Select(g => new TypeCountDto { Type = g.Key, Count = g.Count() })
            .ToList();

        return Ok(new DashboardSummaryResponse
        {
            TotalOrders      = orders.Count,
            PendingOrders    = orders.Count(o => o.Status == OrderStatus.Pending),
            PreparingOrders  = orders.Count(o => o.Status == OrderStatus.Preparing),
            DeliveredOrders  = orders.Count(o => o.Status == OrderStatus.Delivered),
            CancelledOrders  = orders.Count(o => o.Status == OrderStatus.Cancelled),
            TotalRevenue     = orders.Where(o => o.Status == OrderStatus.Delivered).Sum(o => o.TotalAmount),
            OrdersByStatus   = byStatus,
            OrdersByType     = byType
        });
    }
}
