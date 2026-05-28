using FoodOrderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodOrderApi.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        // 1. Seed Users
        await SeedUserAsync(db, "Admin", "admin@foodorder.com", "Admin@1234", "Admin");
        await SeedUserAsync(db, "User",  "user@foodorder.com",  "User@1234",  "User");
        await SeedUserAsync(db, "User2", "user2@foodorder.com", "User@1234",  "User");

        // 2. Seed Menu Items
        await SeedMenuItemsAsync(db);
    }

    private static async Task SeedUserAsync(
        AppDbContext db, string fullName, string email, string password, string role)
    {
        if (await db.Users.AnyAsync(u => u.Email == email)) return;

        db.Users.Add(new User
        {
            FullName     = fullName,
            Email        = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role         = role,
            CreatedAt    = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
    }

    private static async Task SeedMenuItemsAsync(AppDbContext db)
    {
        // Check if the menu already has items asynchronously 
        if (await db.MenuItems.AnyAsync()) return;

        db.MenuItems.AddRange(
            new MenuItem { Id = 1, Name = "Burger Classic",  Description = "Beef patty with lettuce",    Price = 120, Category = "Burger", IsAvailable = true },
            new MenuItem { Id = 2, Name = "Cheese Pizza",    Description = "Mozzarella and tomato sauce", Price = 180, Category = "Pizza",  IsAvailable = true },
            new MenuItem { Id = 3, Name = "Pad Thai",        Description = "Stir-fried rice noodles",    Price = 90,  Category = "Thai",   IsAvailable = true },
            new MenuItem { Id = 4, Name = "Green Salad",     Description = "Fresh garden vegetables",    Price = 75,  Category = "Salad",  IsAvailable = true },
            new MenuItem { Id = 5, Name = "Coca Cola",       Description = "330ml can",                  Price = 35,  Category = "Drink",  IsAvailable = true }
        );
        
        // Save changes asynchronously
        await db.SaveChangesAsync(); 
    }
}