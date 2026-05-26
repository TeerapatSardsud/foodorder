using FoodOrderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodOrderApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Order>     Orders     => Set<Order>();
    public DbSet<User>      Users      => Set<User>();
    public DbSet<MenuItem>  MenuItems  => Set<MenuItem>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Relationships
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Customer)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.CustomerId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.MenuItem)
            .WithMany()
            .HasForeignKey(oi => oi.MenuItemId);

        // Store enums as strings for readability
        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Order>()
            .Property(o => o.OrderType)
            .HasConversion<string>();

        // Seed MenuItems
        modelBuilder.Entity<MenuItem>().HasData(
            new MenuItem { Id = 1, Name = "Burger Classic",  Description = "Beef patty with lettuce",    Price = 120, Category = "Burger", IsAvailable = true },
            new MenuItem { Id = 2, Name = "Cheese Pizza",    Description = "Mozzarella and tomato sauce", Price = 180, Category = "Pizza",  IsAvailable = true },
            new MenuItem { Id = 3, Name = "Pad Thai",        Description = "Stir-fried rice noodles",    Price = 90,  Category = "Thai",   IsAvailable = true },
            new MenuItem { Id = 4, Name = "Green Salad",     Description = "Fresh garden vegetables",    Price = 75,  Category = "Salad",  IsAvailable = true },
            new MenuItem { Id = 5, Name = "Coca Cola",       Description = "330ml can",                  Price = 35,  Category = "Drink",  IsAvailable = true }
        );
    }
}
