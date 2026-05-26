import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'menu',      loadComponent: () => import('./features/menu/menu.component').then(m => m.MenuComponent),                canActivate: [authGuard] },
  { path: 'checkout',  loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),    canActivate: [authGuard] },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard, adminGuard] },
  { path: 'orders',    loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent), canActivate: [authGuard, adminGuard] },
];
