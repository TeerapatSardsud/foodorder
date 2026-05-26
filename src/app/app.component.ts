import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, BadgeModule, ButtonModule, TagModule, AvatarModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  auth = inject(AuthService);
  private cartService = inject(CartService);
 
  cartCount$ = this.cartService.count$;
 
  menuItems: MenuItem[] = [
    { label: 'Menu',      icon: 'pi pi-fw pi-book', routerLink: ['/menu'] },
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
    { label: 'Orders',    icon: 'pi pi-fw pi-list', routerLink: ['/orders'] },
  ];
 
  initials = computed(() => {
    const name = this.auth.currentUser()?.fullName ?? '';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  });
}
