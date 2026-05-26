import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
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
