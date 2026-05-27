import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { OrderService, Order, ORDER_STATUS_OPTIONS, ORDER_TYPE_OPTIONS, CreateOrderRequest, UpdateOrderRequest } from '../../../core/services/order.service';
import { UserService, User } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextareaModule, ButtonModule],
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {
  @Input() order: Order | null = null;
  @Output() saved = new EventEmitter<Order>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  form!: FormGroup;
  customers: User[] = [];
  saving = false;
  statusOptions = ORDER_STATUS_OPTIONS;
  typeOptions = ORDER_TYPE_OPTIONS;
  isAdmin = this.authService.isAdmin();

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
