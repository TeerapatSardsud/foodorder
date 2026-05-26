import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { OrderService, Order, ORDER_STATUS_OPTIONS, ORDER_TYPE_OPTIONS, CreateOrderRequest, UpdateOrderRequest } from '../../../core/services/order.service';
import { UserService, User } from '../../../core/services/user.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextareaModule, ButtonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-3 p-2">
      <div class="field">
        <label class="font-medium block mb-1">Description *</label>
        <textarea pInputTextarea formControlName="description" rows="2" class="w-full" placeholder="e.g. Table 5 - no spicy"></textarea>
        <small class="text-red-500" *ngIf="form.get('description')?.invalid && form.get('description')?.touched">Description is required</small>
      </div>
      <div class="field" *ngIf="!order">
        <label class="font-medium block mb-1">Customer *</label>
        <p-dropdown formControlName="customerId" [options]="customers" optionLabel="fullName" optionValue="id" placeholder="Select customer" styleClass="w-full"></p-dropdown>
        <small class="text-red-500" *ngIf="form.get('customerId')?.invalid && form.get('customerId')?.touched">Customer is required</small>
      </div>
      <div class="field">
        <label class="font-medium block mb-1">Order Type</label>
        <p-dropdown formControlName="orderType" [options]="typeOptions" optionLabel="label" optionValue="value" styleClass="w-full"></p-dropdown>
      </div>
      <div class="field" *ngIf="order">
        <label class="font-medium block mb-1">Status</label>
        <p-dropdown formControlName="status" [options]="statusOptions" optionLabel="label" optionValue="value" styleClass="w-full"></p-dropdown>
      </div>
      <div class="flex justify-content-end gap-2 mt-2">
        <p-button label="Cancel" severity="secondary" [outlined]="true" type="button" (onClick)="cancelled.emit()"></p-button>
        <p-button [label]="order ? 'Save Changes' : 'Create Order'" type="submit" [loading]="saving"></p-button>
      </div>
    </form>
  `
})
export class OrderFormComponent implements OnInit {
  @Input() order: Order | null = null;
  @Output() saved = new EventEmitter<Order>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  form!: FormGroup;
  customers: User[] = [];
  saving = false;
  statusOptions = ORDER_STATUS_OPTIONS;
  typeOptions = ORDER_TYPE_OPTIONS;

ngOnInit() {
  this.userService.getAll().subscribe(u => this.customers = u);

  const statusVal = this.order
    ? (ORDER_STATUS_OPTIONS.find(s => s.label === this.order!.status)?.value ?? 0)
    : 0;
  const typeVal = this.order
    ? (ORDER_TYPE_OPTIONS.find(t => t.label === this.order!.orderType)?.value ?? 0)
    : 0;

  this.form = this.fb.group({
    description: [this.order?.description ?? '', [Validators.required]],  // ✅ เพิ่ม
    customerId:  [null, this.order ? [] : [Validators.required]],         // ✅ เพิ่ม
    orderType:   [typeVal],
    status:      [statusVal],
  });

  
}

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const v = this.form.value;
    const obs = this.order
      ? this.orderService.update(this.order.id, { description: v.description, status: v.status, orderType: v.orderType } as UpdateOrderRequest)
      : this.orderService.create({ description: v.description, orderType: v.orderType, customerId: v.customerId, items: [] } as CreateOrderRequest);
    obs.subscribe({ next: o => { this.saving = false; this.saved.emit(o); }, error: () => { this.saving = false; } });
  }
}
