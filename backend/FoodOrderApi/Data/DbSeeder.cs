using FoodOrderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodOrderApi.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        await SeedUserAsync(db, "Admin", "admin@foodorder.com", "Admin@1234", "Admin");
        await SeedUserAsync(db, "User",  "user@foodorder.com",  "User@1234",  "User");
        await SeedUserAsync(db, "User2",  "user2@foodorder.com",  "User@1234",  "User");
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
}
