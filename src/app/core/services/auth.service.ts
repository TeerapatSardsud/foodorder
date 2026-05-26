import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
 
export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Customer';
}
 
// Hardcoded users สำหรับ demo
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: 1, fullName: 'Admin User',   email: 'admin@food.com',   password: 'admin123',    role: 'Admin' },
  { id: 2, fullName: 'Alice Johnson',email: 'alice@example.com',password: 'alice123',    role: 'Customer' },
  { id: 3, fullName: 'Bob Smith',    email: 'bob@example.com',  password: 'bob123',      role: 'Customer' },
];
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(this.loadFromStorage());
 
  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn  = computed(() => this._user() !== null);
  readonly isAdmin     = computed(() => this._user()?.role === 'Admin');
 
  constructor(private router: Router) {}
 
  login(email: string, password: string): boolean {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) return false;
    const user: AuthUser = { id: found.id, fullName: found.fullName, email: found.email, role: found.role };
    this._user.set(user);
    sessionStorage.setItem('auth_user', JSON.stringify(user));
    return true;
  }
 
  logout(): void {
    this._user.set(null);
    sessionStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }
 
  private loadFromStorage(): AuthUser | null {
    try {
      const raw = sessionStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
