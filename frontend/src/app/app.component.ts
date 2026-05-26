import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, BadgeModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private cartService = inject(CartService);
  cartCount$ = this.cartService.count$;

  menuItems: MenuItem[] = [
    { label: 'Menu',      icon: 'pi pi-fw pi-book',  routerLink: ['/menu'] },
    { label: 'Dashboard', icon: 'pi pi-fw pi-home',  routerLink: ['/dashboard'] },
    { label: 'Orders',    icon: 'pi pi-fw pi-list',  routerLink: ['/orders'] },
  ];
}
