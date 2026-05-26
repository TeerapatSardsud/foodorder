// Models/Order.cs
namespace FoodOrderApi.Models;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public OrderType OrderType { get; set; } = OrderType.DineIn;
    public decimal TotalAmount { get; set; }
    public int CustomerId { get; set; }
    public User? Customer { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int MenuItemId { get; set; }
    public MenuItem? MenuItem { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Preparing,
    Ready,
    Delivered,
    Cancelled
}

public enum OrderType
{
    DineIn,
    Takeaway,
    Delivery
}
