using FoodOrderApi.Models;

namespace FoodOrderApi.DTOs;

// ── Request DTOs ──────────────────────────────────────────────────────────────

public class CreateOrderRequest
{
    public string Description { get; set; } = string.Empty;
    public OrderType OrderType { get; set; } = OrderType.DineIn;
    public int CustomerId { get; set; }
    public List<OrderItemRequest> Items { get; set; } = new();
}

public class OrderItemRequest
{
    public int MenuItemId { get; set; }
    public int Quantity { get; set; }
}

public class UpdateOrderRequest
{
    public string Description { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public OrderType OrderType { get; set; }
}

// ── Response DTOs ─────────────────────────────────────────────────────────────

public class OrderResponse
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string OrderType { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
}

public class OrderItemResponse
{
    public int MenuItemId { get; set; }
    public string MenuItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

// ── Dashboard DTOs ────────────────────────────────────────────────────────────

public class DashboardSummaryResponse
{
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public int PreparingOrders { get; set; }
    public int DeliveredOrders { get; set; }
    public int CancelledOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<StatusCountDto> OrdersByStatus { get; set; } = new();
    public List<TypeCountDto> OrdersByType { get; set; } = new();
}

public class StatusCountDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class TypeCountDto
{
    public string Type { get; set; } = string.Empty;
    public int Count { get; set; }
}
