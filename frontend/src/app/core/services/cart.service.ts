import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { MenuItem } from './menu-item.service';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);

  readonly cart$  = this.items$.asObservable();
  readonly count$ = this.items$.pipe(map(items => items.reduce((s, i) => s + i.quantity, 0)));
  readonly total$ = this.items$.pipe(map(items => items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0)));

  get snapshot(): CartItem[] { return this.items$.value; }

  add(menuItem: MenuItem): void {
    const current = this.items$.value;
    const idx = current.findIndex(i => i.menuItem.id === menuItem.id);
    if (idx >= 0) {
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      this.items$.next(updated);
    } else {
      this.items$.next([...current, { menuItem, quantity: 1 }]);
    }
  }

  remove(menuItemId: number): void {
    this.items$.next(this.items$.value.filter(i => i.menuItem.id !== menuItemId));
  }

  updateQty(menuItemId: number, quantity: number): void {
    if (quantity <= 0) { this.remove(menuItemId); return; }
    this.items$.next(
      this.items$.value.map(i => i.menuItem.id === menuItemId ? { ...i, quantity } : i)
    );
  }

  clear(): void { this.items$.next([]); }
}
