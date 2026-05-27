using FoodOrderApi.Data;
using FoodOrderApi.DTOs;
using FoodOrderApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

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
        var allOrders = await _db.Orders.ToListAsync();

        // 1. Get ONLY Confirmed orders
        var confirmedOrders = allOrders.Where(o => o.Status == OrderStatus.Confirmed).ToList();

        var response = new DashboardSummaryResponse
        {
            TotalOrders = confirmedOrders.Count, 
            DeliveredOrders = confirmedOrders.Count(o => o.OrderType == OrderType.Delivery),
            TotalRevenue = confirmedOrders.Sum(o => o.TotalAmount),

            // Keep other statuses using allOrders so the dashboard still counts them correctly
            PendingOrders = allOrders.Count(o => o.Status == OrderStatus.Pending),
            PreparingOrders = allOrders.Count(o => o.Status == OrderStatus.Preparing),
            CancelledOrders = allOrders.Count(o => o.Status == OrderStatus.Cancelled),

            OrdersByStatus = allOrders
                .GroupBy(o => o.Status)
                .Select(g => new StatusCountDto { Status = g.Key.ToString(), Count = g.Count() })
                .ToList(),

            OrdersByType = allOrders
                .GroupBy(o => o.OrderType)
                .Select(g => new TypeCountDto { Type = g.Key.ToString(), Count = g.Count() })
                .ToList()
        };

        return Ok(response);
    }
}