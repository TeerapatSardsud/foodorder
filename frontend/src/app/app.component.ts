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
  template: `
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="text-xl font-bold mr-4">🍔 FoodOrder</span>
      </ng-template>
      <ng-template pTemplate="end">
        <a routerLink="/checkout" class="p-button p-button-text p-button-rounded relative"
           style="text-decoration:none">
          <i class="pi pi-shopping-cart text-xl"></i>
          <span *ngIf="(cartCount$ | async)! > 0"
            class="p-badge p-badge-danger"
            style="position:absolute;top:-4px;right:-4px;font-size:10px;min-width:18px;height:18px;line-height:18px">
            {{ cartCount$ | async }}
          </span>
        </a>
      </ng-template>
    </p-menubar>
    <router-outlet />
  `
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
