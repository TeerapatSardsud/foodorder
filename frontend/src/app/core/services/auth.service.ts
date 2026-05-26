import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: number;
  token: string;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http       = inject(HttpClient);
  private readonly router     = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly base       = `${environment.apiUrl}/auth`;
  private get isBrowser()     { return isPlatformBrowser(this.platformId); }

  currentUser = signal<AuthUser | null>(this.loadUser());

  login(email: string, password: string) {
    return this.http.post<AuthUser>(`${this.base}/login`, { email, password })
      .pipe(tap(user => this.saveUser(user)));
  }

  register(fullName: string, email: string, password: string) {
    return this.http.post<AuthUser>(`${this.base}/register`, { fullName, email, password })
      .pipe(tap(user => this.saveUser(user)));
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem('auth_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken()   { return this.currentUser()?.token ?? null; }
  isAdmin()    { return this.currentUser()?.role === 'Admin'; }
  isLoggedIn() { return !!this.currentUser(); }

  private saveUser(user: AuthUser) {
    if (this.isBrowser) localStorage.setItem('auth_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): AuthUser | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    if (!user.id || this.isTokenExpired(user.token)) {
      localStorage.removeItem('auth_user');
      return null;
    }
    return user;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
