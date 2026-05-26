import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, BadgeModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  cartCount$ = this.cartService.count$;

  menuItems = computed<MenuItem[]>(() => {
    const isAdmin = this.authService.isAdmin();
    return [
      { label: 'Menu',   icon: 'pi pi-fw pi-book', routerLink: ['/menu'] },
      { label: 'Orders', icon: 'pi pi-fw pi-list', routerLink: ['/orders'] },
      ...(isAdmin ? [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
      ] : []),
    ];
  });
}
