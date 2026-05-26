import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenuItemService, MenuItem } from '../../core/services/menu-item.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule, ToastModule],
  providers: [MessageService],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  private menuItemService = inject(MenuItemService);
  private cartService     = inject(CartService);
  private router          = inject(Router);
  private toast           = inject(MessageService);

  items: MenuItem[]                         = [];
  itemsByCategory: Record<string, MenuItem[]> = {};
  categories: string[]                      = [];
  cartCount$ = this.cartService.count$;

  ngOnInit() {
    this.menuItemService.getAll().subscribe(items => {
      this.items = items;
      // จัดกลุ่มตาม category
      this.itemsByCategory = items.reduce((acc, item) => {
        (acc[item.category] ??= []).push(item);
        return acc;
      }, {} as Record<string, MenuItem[]>);
      this.categories = Object.keys(this.itemsByCategory).sort();
    });
  }

  getQty(id: number): number {
    return this.cartService.snapshot.find(i => i.menuItem.id === id)?.quantity ?? 0;
  }

  add(item: MenuItem) {
    this.cartService.add(item);
    this.toast.add({ severity: 'success', summary: 'เพิ่มแล้ว', detail: item.name, life: 1500 });
  }

  decrease(item: MenuItem) {
    const qty = this.getQty(item.id);
    this.cartService.updateQty(item.id, qty - 1);
  }

  goCheckout() { this.router.navigate(['/checkout']); }
}
