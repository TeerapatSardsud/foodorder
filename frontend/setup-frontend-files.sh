#!/bin/bash
# รันจาก: food-order-system 2/frontend/
# bash setup-frontend-files.sh

mkdir -p src/app/core/services
mkdir -p src/app/features/orders/order-list
mkdir -p src/app/features/orders/order-form
mkdir -p src/app/features/dashboard

# ─── order.service.ts ────────────────────────────────────────────────────────
cat > src/app/core/services/order.service.ts << 'EOF'
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  orderNumber: string;
  description: string;
  status: string;
  orderType: string;
  totalAmount: number;
  customerId: number;
  customerName: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  description: string;
  orderType: number;
  customerId: number;
  items: { menuItemId: number; quantity: number }[];
}

export interface UpdateOrderRequest {
  description: string;
  status: number;
  orderType: number;
}

export const ORDER_STATUS_OPTIONS = [
  { label: 'Pending',   value: 0 },
  { label: 'Confirmed', value: 1 },
  { label: 'Preparing', value: 2 },
  { label: 'Ready',     value: 3 },
  { label: 'Delivered', value: 4 },
  { label: 'Cancelled', value: 5 },
];

export const ORDER_TYPE_OPTIONS = [
  { label: 'DineIn',   value: 0 },
  { label: 'Takeaway', value: 1 },
  { label: 'Delivery', value: 2 },
];

export const STATUS_SEVERITY: Record<string, string> = {
  Pending:   'warning',
  Confirmed: 'info',
  Preparing: 'info',
  Ready:     'success',
  Delivered: 'success',
  Cancelled: 'danger',
};

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/orders';

  getAll(): Observable<Order[]>              { return this.http.get<Order[]>(this.baseUrl); }
  getById(id: number): Observable<Order>    { return this.http.get<Order>(`${this.baseUrl}/${id}`); }
  create(r: CreateOrderRequest): Observable<Order> { return this.http.post<Order>(this.baseUrl, r); }
  update(id: number, r: UpdateOrderRequest): Observable<Order> { return this.http.put<Order>(`${this.baseUrl}/${id}`, r); }
  delete(id: number): Observable<void>      { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
EOF

# ─── user.service.ts ─────────────────────────────────────────────────────────
cat > src/app/core/services/user.service.ts << 'EOF'
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  getAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/users');
  }
}
EOF

# ─── dashboard.service.ts ────────────────────────────────────────────────────
cat > src/app/core/services/dashboard.service.ts << 'EOF'
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  ordersByStatus: { status: string; count: number }[];
  ordersByType: { type: string; count: number }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>('http://localhost:5000/api/dashboard/summary');
  }
}
EOF

# ─── order-form.component.ts ─────────────────────────────────────────────────
cat > src/app/features/orders/order-form/order-form.component.ts << 'EOF'
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
    const statusIdx = this.order ? ORDER_STATUS_OPTIONS.findIndex(s => s.label === this.order!.status) : 0;
    const typeIdx   = this.order ? ORDER_TYPE_OPTIONS.findIndex(t => t.label === this.order!.orderType) : 0;
    this.form = this.fb.group({
      description: [this.order?.description ?? '', [Validators.required]],
      customerId:  [null, this.order ? [] : [Validators.required]],
      orderType:   [typeIdx >= 0 ? typeIdx : 0],
      status:      [statusIdx >= 0 ? statusIdx : 0],
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
EOF

# ─── order-list.component.ts ─────────────────────────────────────────────────
cat > src/app/features/orders/order-list/order-list.component.ts << 'EOF'
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OrderService, Order, STATUS_SEVERITY } from '../../../core/services/order.service';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, DialogModule, ToastModule, ConfirmDialogModule, OrderFormComponent],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="p-4">
      <div class="flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="text-2xl font-bold m-0">Orders</h1>
          <p class="text-color-secondary mt-1">Manage all food orders</p>
        </div>
        <p-button label="New Order" icon="pi pi-plus" (onClick)="openCreate()"></p-button>
      </div>
      <p-table [value]="orders" [loading]="loading" [paginator]="true" [rows]="10" dataKey="id" styleClass="p-datatable-gridlines">
        <ng-template pTemplate="header">
          <tr>
            <th>Order #</th><th>Customer</th><th>Type</th><th>Status</th><th>Total</th><th>Date</th><th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-o>
          <tr>
            <td><span class="font-semibold">{{ o.orderNumber }}</span></td>
            <td>{{ o.customerName }}</td>
            <td><p-tag [value]="o.orderType" severity="info"></p-tag></td>
            <td><p-tag [value]="o.status" [severity]="getSeverity(o.status)"></p-tag></td>
            <td>฿{{ o.totalAmount | number:'1.2-2' }}</td>
            <td>{{ o.createdAt | date:'dd/MM/yy HH:mm' }}</td>
            <td>
              <p-button icon="pi pi-pencil" severity="secondary" [text]="true" [rounded]="true" (onClick)="openEdit(o)"></p-button>
              <p-button icon="pi pi-trash" severity="danger" [text]="true" [rounded]="true" (onClick)="confirmDelete(o)"></p-button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr><td colspan="7" class="text-center py-5 text-color-secondary">No orders yet. Create your first order!</td></tr>
        </ng-template>
      </p-table>
    </div>
    <p-dialog [(visible)]="dialogVisible" [header]="editing ? 'Edit Order' : 'New Order'" [modal]="true" [style]="{width:'480px'}" [draggable]="false">
      <app-order-form [order]="editing" (saved)="onSaved($event)" (cancelled)="dialogVisible=false"></app-order-form>
    </p-dialog>
    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
  `
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  orders: Order[] = [];
  loading = false;
  dialogVisible = false;
  editing: Order | null = null;

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: d => { this.orders = d; this.loading = false; },
      error: () => { this.toast.add({ severity:'error', summary:'Error', detail:'Cannot connect to backend' }); this.loading = false; }
    });
  }

  getSeverity(s: string) { return STATUS_SEVERITY[s] ?? 'secondary'; }
  openCreate() { this.editing = null; this.dialogVisible = true; }
  openEdit(o: Order) { this.editing = { ...o }; this.dialogVisible = true; }

  onSaved(o: Order) {
    if (this.editing) {
      const i = this.orders.findIndex(x => x.id === o.id);
      if (i !== -1) this.orders[i] = o;
      this.orders = [...this.orders];
    } else {
      this.orders = [o, ...this.orders];
    }
    this.dialogVisible = false;
    this.toast.add({ severity:'success', summary:'Saved', detail:`${o.orderNumber} saved` });
  }

  confirmDelete(o: Order) {
    this.confirm.confirm({
      message: `Delete order ${o.orderNumber}?`,
      accept: () => this.orderService.delete(o.id).subscribe({
        next: () => { this.orders = this.orders.filter(x => x.id !== o.id); this.toast.add({ severity:'success', summary:'Deleted', detail:'Order removed' }); },
        error: () => this.toast.add({ severity:'error', summary:'Error', detail:'Delete failed' })
      })
    });
  }
}
EOF

# ─── dashboard.component.ts ──────────────────────────────────────────────────
cat > src/app/features/dashboard/dashboard.component.ts << 'EOF'
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { DashboardService, DashboardSummary } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, SkeletonModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-1">Dashboard</h1>
      <p class="text-color-secondary mb-4">Food Order System Overview</p>
      <ng-container *ngIf="summary; else loading">
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-3" *ngFor="let c of cards">
            <p-card styleClass="h-full">
              <div class="flex align-items-center justify-content-between">
                <div>
                  <p class="text-color-secondary text-sm m-0">{{ c.label }}</p>
                  <p class="text-3xl font-bold m-0 mt-1" [style.color]="c.color">{{ c.prefix }}{{ c.value | number }}</p>
                </div>
                <i [class]="'pi ' + c.icon" [style.color]="c.color" style="font-size:2rem;opacity:0.6"></i>
              </div>
            </p-card>
          </div>
          <div class="col-12 md:col-6">
            <p-card header="Orders by Status">
              <p-chart type="doughnut" [data]="statusChart" [options]="chartOpts"></p-chart>
            </p-card>
          </div>
          <div class="col-12 md:col-6">
            <p-card header="Orders by Type">
              <p-chart type="bar" [data]="typeChart" [options]="chartOpts"></p-chart>
            </p-card>
          </div>
        </div>
      </ng-container>
      <ng-template #loading>
        <div class="grid">
          <div class="col-12 md:col-3" *ngFor="let i of [1,2,3,4]">
            <p-skeleton height="100px" borderRadius="8px"></p-skeleton>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private svc = inject(DashboardService);
  summary: DashboardSummary | null = null;
  cards: any[] = [];
  statusChart: any = {};
  typeChart: any = {};
  chartOpts = { responsive: true, plugins: { legend: { position: 'bottom' } } };

  ngOnInit() {
    this.svc.getSummary().subscribe(d => {
      this.summary = d;
      this.cards = [
        { label: 'Total Orders',  value: d.totalOrders,    color: '#6366f1', icon: 'pi-list',         prefix: '' },
        { label: 'Pending',       value: d.pendingOrders,  color: '#f59e0b', icon: 'pi-clock',        prefix: '' },
        { label: 'Delivered',     value: d.deliveredOrders,color: '#10b981', icon: 'pi-check-circle', prefix: '' },
        { label: 'Revenue',       value: d.totalRevenue,   color: '#3b82f6', icon: 'pi-wallet',       prefix: '฿' },
      ];
      this.statusChart = {
        labels: d.ordersByStatus.map(s => s.status),
        datasets: [{ data: d.ordersByStatus.map(s => s.count), backgroundColor: ['#f59e0b','#6366f1','#f97316','#10b981','#3b82f6','#ef4444'] }]
      };
      this.typeChart = {
        labels: d.ordersByType.map(t => t.type),
        datasets: [{ label: 'Orders', data: d.ordersByType.map(t => t.count), backgroundColor: ['#6366f1','#10b981','#f59e0b'] }]
      };
    });
  }
}
EOF

# ─── app.routes.ts ───────────────────────────────────────────────────────────
cat > src/app/app.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'orders',    loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent) },
];
EOF

# ─── app.component.ts ────────────────────────────────────────────────────────
cat > src/app/app.component.ts << 'EOF'
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MenubarModule],
  template: `
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="text-xl font-bold mr-4">🍔 FoodOrder</span>
      </ng-template>
    </p-menubar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'] },
    { label: 'Orders',    icon: 'pi pi-list', routerLink: ['/orders'] },
  ];
}
EOF

# ─── app.config.ts ───────────────────────────────────────────────────────────
cat > src/app/app.config.ts << 'EOF'
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
  ],
};
EOF

echo ""
echo "✅ All files created!"
echo ""
echo "Next steps:"
echo "  1. Add PrimeNG styles to angular.json (see README)"
echo "  2. ng serve"
