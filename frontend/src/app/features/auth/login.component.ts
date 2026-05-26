import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>🍔 Food Order</h2>
        <h3>Login</h3>
        <div *ngIf="error" class="error">{{ error }}</div>
        <input [(ngModel)]="email"    placeholder="Email"    type="email"    />
        <input [(ngModel)]="password" placeholder="Password" type="password" />
        <button (click)="login()" [disabled]="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <p>Don't have an account? <a routerLink="/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display:flex; justify-content:center; align-items:center; height:100vh; background:#f5f5f5; }
    .auth-card { background:white; padding:2rem; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,.1); width:360px; display:flex; flex-direction:column; gap:1rem; }
    h2 { text-align:center; margin:0; font-size:1.8rem; }
    h3 { text-align:center; margin:0; color:#555; }
    input { padding:.75rem; border:1px solid #ddd; border-radius:8px; font-size:1rem; }
    button { padding:.75rem; background:#e74c3c; color:white; border:none; border-radius:8px; font-size:1rem; cursor:pointer; }
    button:disabled { opacity:.6; }
    .error { background:#ffe0e0; color:#c0392b; padding:.5rem; border-radius:6px; font-size:.9rem; }
    p { text-align:center; margin:0; font-size:.9rem; }
    a { color:#e74c3c; }
  `]
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  email = ''; password = ''; error = ''; loading = false;

  login() {
    this.loading = true; this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: user => this.router.navigate([user.role === 'Admin' ? '/dashboard' : '/menu']),
      error: err  => { this.error = err.error?.error ?? 'Login failed'; this.loading = false; }
    });
  }
}
