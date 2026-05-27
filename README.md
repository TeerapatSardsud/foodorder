# 🍔 Food Order System

A full-stack food ordering platform built with **Angular 17** (PrimeNG) and **C# ASP.NET Core 8** (Entity Framework Core + SQLite).

---

## ⚙️ How It Works

This system provides a complete end-to-end flow for submitting and managing food orders:

* **Customer Ordering:** Users can browse menu items, add them to their cart, and place an order (Delivery or Dine-in/Pickup).
* **Admin Dashboard:** Administrators have a dedicated view to track real-time statistics, such as total revenue and the number of orders sorted by their current status.
* **Order Lifecycle Management:** Admins can process orders by moving them through a realistic workflow: `Pending` → `Confirmed` → `Delivered` → `Cancelled`.
* **Dynamic Filtering:** The frontend table allows users and admins to instantly filter orders by status without needing to refresh the page.

---

## 🚀 How to Get Started

### Prerequisites
Make sure you have the following installed on your machine:
* **.NET 8 SDK** (for the backend)
* **Node.js** v18 or v20 (for the frontend)
* **Angular CLI**

### 1. Start the Backend
Open your terminal, navigate to the backend folder, set up the SQLite database, and run the server:

```bash
cd backend/FoodOrderApi
dotnet restore
dotnet ef database update
dotnet run

```

* **API runs at:** `https://localhost:7001`
* **Swagger UI Documentation:** `https://localhost:7001/swagger`

### 2. Start the Frontend

Open a **new** terminal window (leave the backend running), navigate to the frontend folder, install dependencies, and launch the web app:

```bash
cd frontend
npm install
ng serve

```

* **App runs at:** `http://localhost:4200`

