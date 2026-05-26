import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService, ORDER_TYPE_OPTIONS } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, InputTextareaModule, ToastModule],
  providers: [MessageService],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  private cartService  = inject(CartService);
  private orderService = inject(OrderService);
  private authService  = inject(AuthService);
  private router       = inject(Router);
  private toast        = inject(MessageService);

  cartItems: CartItem[] = [];
  total = 0;
  typeOptions           = ORDER_TYPE_OPTIONS;

  selectedOrderType: number | null = null;
  description       = '';
  submitting        = false;

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
    });
  }

  increaseQty(item: CartItem) {
    this.cartService.updateQty(item.menuItem.id, item.quantity + 1);
  }

  decreaseQty(item: CartItem) {
    this.cartService.updateQty(item.menuItem.id, item.quantity - 1);
  }

  removeItem(id: number) {
    this.cartService.remove(id);
  }

  back() { this.router.navigate(['/menu']); }

  confirmOrder(form: NgForm) {
    form.form.markAllAsTouched();
    const customerId = this.authService.currentUser()?.id;
    if (form.invalid || !customerId) return;
    this.submitting = true;

    this.orderService.create({
      description: this.description || 'Order from menu',
      orderType:   this.selectedOrderType!,
      customerId,
      items: this.cartItems.map(i => ({
        menuItemId: i.menuItem.id,
        quantity:   i.quantity,
      })),
    }).subscribe({
      next: order => {
        this.submitting = false;
        this.cartService.clear();
        this.toast.add({
          severity: 'success',
          summary: 'สั่งอาหารสำเร็จ!',
          detail: `${order.orderNumber} — ฿${order.totalAmount}`,
          life: 3000,
        });
        setTimeout(() => this.router.navigate(['/menu']), 2000);
      },
      error: () => {
        this.submitting = false;
        this.toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', detail: 'ไม่สามารถสร้างออเดอร์ได้' });
      },
    });
  }
}
