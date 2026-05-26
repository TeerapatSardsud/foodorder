using System.Text;
using FoodOrderApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=foodorder.db"));

var jwtSecret = builder.Configuration["Jwt:Secret"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer   = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();

// ยุบรวม CORS เป็นอันเดียว แล้วใส่คอมมา ( , ) คั่นระหว่าง URL ได้เลยครับ ปลอดภัยกว่า
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200", "http://localhost:64229")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// เรียกใช้งาน CORS (ต้องอยู่ก่อน Authentication และ Authorization เสมอ)
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        db.Users.Add(new FoodOrderApi.Models.User
        {
            FullName     = "Admin",
            Email        = "admin@foodorder.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@1234"),
            Role         = "Admin",
            CreatedAt    = DateTime.UtcNow
        });
        db.SaveChanges();
    }
    if (!db.Users.Any(u => u.Role == "User"))
    {
        db.Users.Add(new FoodOrderApi.Models.User
        {
            FullName     = "User",
            Email        = "user@foodorder.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@1234"),
            Role         = "User",
            CreatedAt    = DateTime.UtcNow
        });
        db.SaveChanges();
    }
}

app.Run("http://localhost:5000");