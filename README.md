# 🍔 Food Order System
> Full-Stack Challenge — Angular 17 + PrimeNG + C# ASP.NET Core 8 + EF Core + SQLite

---

## 👥 Team Roles

| คน | Role | ความรับผิดชอบ |
|----|------|----------------|
| คนที่ 1 | Team Lead + Backend Core | Order CRUD API, EF Core, DB, Project setup |
| คนที่ 2 | Backend Support | User API, MenuItem API, Dashboard, DTOs, Swagger |
| คนที่ 3 | Frontend Core | Angular setup, PrimeNG, Order pages, Services |
| คนที่ 4 | Frontend UI | Dashboard page, State management, Validation |
| คนที่ 5 | Integration + QA | Wire frontend↔backend, Postman, CORS, README |

---

## 🗂️ Project Structure

```
food-order-system/
├── backend/
│   └── FoodOrderApi/
│       ├── Controllers/
│       │   ├── OrdersController.cs
│       │   ├── UsersController.cs
│       │   ├── MenuItemsController.cs
│       │   └── DashboardController.cs
│       ├── Models/
│       │   ├── Order.cs
│       │   ├── User.cs
│       │   └── MenuItem.cs
│       ├── DTOs/
│       │   ├── OrderDto.cs
│       │   └── DashboardSummaryDto.cs
│       ├── Data/
│       │   └── AppDbContext.cs
│       ├── Services/
│       │   └── OrderService.cs
│       └── Program.cs
└── frontend/
    └── src/app/
        ├── core/
        │   └── services/
        │       ├── order.service.ts
        │       ├── user.service.ts
        │       └── menu-item.service.ts
        ├── features/
        │   ├── orders/
        │   │   ├── order-list/
        │   │   └── order-form/
        │   └── dashboard/
        └── shared/components/
```

---

## 🚀 Getting Started

### Backend (คนที่ 1 ทำก่อน)

```bash
cd backend/FoodOrderApi
dotnet restore
dotnet ef database update
dotnet run
# API runs at: https://localhost:7001
# Swagger UI: https://localhost:7001/swagger
```

### Frontend (คนที่ 3 ทำพร้อมกัน)

```bash
cd frontend
npm install
ng serve
# App runs at: http://localhost:4200
```

---

## 🔗 API Endpoints (6 required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/{id}` | Update order |
| DELETE | `/api/orders/{id}` | Delete order |
| GET | `/api/users` | List all users |
| GET | `/api/dashboard/summary` | Dashboard counts |
| GET | `/api/menuitems` | List menu items (bonus) |

---

## 📊 Data Model

### Order
```
Id, OrderNumber, Description, Status, OrderType, CustomerId, CreatedAt, TotalAmount
```

### User
```
Id, FullName, Email, Role, CreatedAt
```

### MenuItem
```
Id, Name, Description, Price, Category, IsAvailable
```

### Order Status: Pending → Confirmed → Preparing → Ready → Delivered → Cancelled

---

## 🛠️ Tech Stack

- **Frontend**: Angular 17, PrimeNG 17, TypeScript
- **Backend**: ASP.NET Core 8, C#
- **ORM**: Entity Framework Core 8
- **Database**: SQLite (dev) / SQL Server (prod)
- **API Docs**: Swagger / Postman
- **Version Control**: Git + GitHub

---

## 📅 Timeline

| Week | Focus |
|------|-------|
| Week 1 | Setup repo, Backend models + API, Angular project init |
| Week 2 | Frontend pages + Services, Connect to real API |
| Week 3 | Dashboard, State management, Testing, Polish |
# foodorder
