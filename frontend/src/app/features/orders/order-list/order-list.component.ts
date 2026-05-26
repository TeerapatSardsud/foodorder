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

  getSeverity(s: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
  return (STATUS_SEVERITY[s] as 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast') ?? 'secondary';}  
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
