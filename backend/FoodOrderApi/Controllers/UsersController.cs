using FoodOrderApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodOrderApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    public UsersController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _db.Users
            .Select(u => new { u.Id, u.FullName, u.Email, u.Role, u.CreatedAt })
            .ToListAsync();
        return Ok(users);
    }
}
