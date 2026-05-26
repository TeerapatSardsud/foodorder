using FoodOrderApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodOrderApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuItemsController : ControllerBase
{
    private readonly AppDbContext _db;
    public MenuItemsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _db.MenuItems
            .Where(m => m.IsAvailable)
            .OrderBy(m => m.Category)
            .ToListAsync();
        return Ok(items);
    }
}
