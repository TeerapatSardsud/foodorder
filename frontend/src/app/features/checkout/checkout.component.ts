import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  template: `
    <div class="p-4 max-w-600px mx-auto">

      <!-- Header -->
      <div class="flex align-items-center gap-3 mb-4">
        <p-button icon="pi pi-arrow-left" [text]="true" [rounded]="true" severity="secondary"
          (onClick)="back()"></p-button>
        <div>
          <h1 class="text-2xl font-bold m-0">ยืนยันออเดอร์</h1>
          <p class="text-color-secondary mt-1">ตรวจสอบรายการก่อน checkout</p>
        </div>
      </div>

      <!-- Empty cart -->
      <div *ngIf="cartItems.length === 0" class="text-center py-8">
        <i class="pi pi-shopping-cart text-5xl text-color-secondary"></i>
        <p class="text-color-secondary mt-3">ตะกร้าว่างอยู่</p>
        <p-button label="กลับไปเลือกเมนู" icon="pi pi-arrow-left" (onClick)="back()"></p-button>
      </div>

      <ng-container *ngIf="cartItems.length > 0">

        <!-- Cart items -->
        <div class="surface-card border-round-lg border-1 surface-border mb-3">
          <div class="p-3 border-bottom-1 surface-border">
            <span class="font-semibold">รายการที่สั่ง</span>
          </div>
          <div class="p-3">
            <div *ngFor="let item of cartItems"
                 class="flex align-items-center justify-content-between py-2 border-bottom-1 surface-border last:border-none">
              <div class="flex align-items-center gap-3">
                <div class="flex align-items-center gap-1">
                  <p-button icon="pi pi-minus" [text]="true" [rounded]="true" severity="secondary" size="small"
                    (onClick)="decreaseQty(item)"></p-button>
                  <span class="font-bold w-1rem text-center">{{ item.quantity }}</span>
                  <p-button icon="pi pi-plus" [text]="true" [rounded]="true" severity="secondary" size="small"
                    (onClick)="increaseQty(item)"></p-button>
                </div>
                <span class="text-sm">{{ item.menuItem.name }}</span>
              </div>
              <div class="flex align-items-center gap-2">
                <span class="text-sm font-semibold">฿{{ item.menuItem.price * item.quantity | number:'1.2-2' }}</span>
                <p-button icon="pi pi-trash" [text]="true" [rounded]="true" severity="danger" size="small"
                  (onClick)="removeItem(item.menuItem.id)"></p-button>
              </div>
            </div>
            <div class="flex justify-content-end mt-3 pt-2 border-top-1 surface-border">
              <span class="font-bold text-lg">รวม ฿{{ total | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>

        <!-- Order info form -->
        <div class="surface-card border-round-lg border-1 surface-border mb-3 p-3 flex flex-column gap-3">
          <span class="font-semibold">ข้อมูลการสั่ง</span>

          <div class="field m-0">
            <label class="font-medium block mb-1 text-sm">ประเภทออเดอร์</label>
            <p-dropdown [(ngModel)]="selectedOrderType"
              [options]="typeOptions" optionLabel="label" optionValue="value"
              styleClass="w-full">
            </p-dropdown>
          </div>

          <div class="field m-0">
            <label class="font-medium block mb-1 text-sm">หมายเหตุ</label>
            <textarea pInputTextarea [(ngModel)]="description" rows="2"
              class="w-full" placeholder="เช่น โต๊ะ 5, ไม่เผ็ด">
            </textarea>
          </div>
        </div>

        <!-- Submit -->
        <p-button
          label="ยืนยันออเดอร์"
          icon="pi pi-check"
          styleClass="w-full"
          [loading]="submitting"
          (onClick)="confirmOrder()">
        </p-button>

      </ng-container>
    </div>
    <p-toast></p-toast>
  `
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

  selectedOrderType = 0;
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

  confirmOrder() {
    const customerId = this.authService.currentUser()?.id;
    if (!customerId) return;
    this.submitting = true;

    this.orderService.create({
      description: this.description || 'Order from menu',
      orderType:   this.selectedOrderType,
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
