import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
