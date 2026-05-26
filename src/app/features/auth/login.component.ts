import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule, MessageModule],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen" style="background:#f8fafc">
      <p-card styleClass="shadow-4" style="width:400px">
        <div class="text-center mb-4">
          <div style="font-size:3rem">🍔</div>
          <h2 class="text-2xl font-bold m-0 mt-2">FoodOrder</h2>
          <p class="text-color-secondary mt-1">Sign in to your account</p>
        </div>
 
        <p-message *ngIf="errorMsg()" severity="error" [text]="errorMsg()!" styleClass="w-full mb-3"></p-message>
 
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-3">
          <div class="field">
            <label class="font-medium block mb-1">Email</label>
            <input pInputText formControlName="email" type="email" class="w-full" placeholder="admin@food.com" />
            <small class="text-red-500" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Valid email is required
            </small>
          </div>
 
          <div class="field">
            <label class="font-medium block mb-1">Password</label>
            <p-password formControlName="password" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" placeholder="••••••••"></p-password>
            <small class="text-red-500" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              Password is required
            </small>
          </div>
 
          <p-button label="Sign In" type="submit" styleClass="w-full mt-2" [loading]="loading()"></p-button>
        </form>
 
        <div class="mt-4 p-3 border-round" style="background:#f1f5f9;font-size:0.8rem">
          <p class="font-semibold m-0 mb-2">Demo accounts:</p>
          <p class="m-0">👑 <b>Admin:</b> admin&#64;food.com / admin123</p>
          <p class="m-0 mt-1">👤 <b>Customer:</b> alice&#64;example.com / alice123</p>
        </div>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
 
  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
 
  loading  = signal(false);
  errorMsg = signal<string | null>(null);
 
  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set(null);
 
    const { email, password } = this.form.value;
    setTimeout(() => {   // simulate async
      const ok = this.auth.login(email!, password!);
      this.loading.set(false);
      if (ok) this.router.navigate(['/dashboard']);
      else    this.errorMsg.set('Invalid email or password');
    }, 500);
  }
}
