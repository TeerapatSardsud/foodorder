import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>🍔 Food Order</h2>
        <h3>Register</h3>
        <div *ngIf="error" class="error">{{ error }}</div>
        <input [(ngModel)]="fullName" placeholder="Full Name"  type="text"     />
        <input [(ngModel)]="email"    placeholder="Email"      type="email"    />
        <input [(ngModel)]="password" placeholder="Password"   type="password" />
        <button (click)="register()" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
        <p>Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display:flex; justify-content:center; align-items:center; height:100vh; background:#f5f5f5; }
    .auth-card { background:white; padding:2rem; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,.1); width:360px; display:flex; flex-direction:column; gap:1rem; }
    h2 { text-align:center; margin:0; font-size:1.8rem; }
    h3 { text-align:center; margin:0; color:#555; }
    input { padding:.75rem; border:1px solid #ddd; border-radius:8px; font-size:1rem; }
    button { padding:.75rem; background:#27ae60; color:white; border:none; border-radius:8px; font-size:1rem; cursor:pointer; }
    button:disabled { opacity:.6; }
    .error { background:#ffe0e0; color:#c0392b; padding:.5rem; border-radius:6px; font-size:.9rem; }
    p { text-align:center; margin:0; font-size:.9rem; }
    a { color:#27ae60; }
  `]
})
export class RegisterComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  fullName = ''; email = ''; password = ''; error = ''; loading = false;

  register() {
    this.loading = true; this.error = '';
    this.auth.register(this.fullName, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/menu']),
      error: err => { this.error = err.error?.error ?? 'Registration failed'; this.loading = false; }
    });
  }
}
