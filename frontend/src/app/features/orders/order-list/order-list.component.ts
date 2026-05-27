import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OrderService, Order, STATUS_SEVERITY, ORDER_TYPE_OPTIONS, UpdateOrderRequest } from '../../../core/services/order.service';
import { OrderFormComponent } from '../order-form/order-form.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, DialogModule, ToastModule, ConfirmDialogModule, OrderFormComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  orders: Order[] = [];

  filteredOrders: Order[] = [];
  currentStatusFilter = 'All';

  statusCounts: Record<string, number> = {
    All: 0, Pending: 0, Confirmed: 0, Delivered: 0, Cancelled: 0
  };

  loading = false;
  dialogVisible = false;
  editing: Order | null = null;

  isAdmin = this.authService.isAdmin();

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: d => { 
        this.orders = d;
        this.refreshData(); // Update counts and filter
        this.loading = false; 
      },
      error: () => { 
        this.toast.add({ severity:'error', summary:'Error', detail:'Cannot connect to backend' }); 
        this.loading = false; 
      }
    });
  }

  refreshData() {
    // 1. Calculate the counts for each status
    this.statusCounts = {
      All: this.orders.length,
      Pending: this.orders.filter(o => o.status === 'Pending').length,
      Confirmed: this.orders.filter(o => o.status === 'Confirmed').length,
      Delivered: this.orders.filter(o => o.orderType === 'Delivery' && o.status === 'Confirmed').length,
      Cancelled: this.orders.filter(o => o.status === 'Cancelled').length
    };
    // 2. Apply the filter to the table
    if (this.currentStatusFilter === 'All') {
      this.filteredOrders = [...this.orders];
    } else if (this.currentStatusFilter === 'Delivered') {
      // Custom filter for Delivered
      this.filteredOrders = this.orders.filter(o => o.status === 'Confirmed' && o.orderType === 'Delivery');
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.currentStatusFilter);
    }
  }

  setFilter(status: string) {
    this.currentStatusFilter = status;
    this.refreshData();
  }

  getSeverity(s: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
  return (STATUS_SEVERITY[s] as 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast') ?? 'secondary';}  
  openCreate() { this.router.navigate(['/menu']); }
  openEdit(o: Order) { this.editing = { ...o }; this.dialogVisible = true; }

  onSaved(o: Order) {
    if (this.editing) {
      const i = this.orders.findIndex(x => x.id === o.id);
      if (i !== -1) this.orders[i] = o;
      this.orders = [...this.orders];
    } else {
      this.orders = [o, ...this.orders];
    }
    this.refreshData(); // Update counts
    this.dialogVisible = false;
    this.toast.add({ severity:'success', summary:'Saved', detail:`${o.orderNumber} saved` });
  }

  //for customer
  confirmDelete(o: Order) {
    this.confirm.confirm({
      message: `Delete order ${o.orderNumber}?`,
      accept: () => this.orderService.delete(o.id).subscribe({
        next: () => { 
          this.orders = this.orders.filter(x => x.id !== o.id);
          this.refreshData(); // Update counts
          this.toast.add({ severity:'success', summary:'Deleted', detail:'Order removed' }); 
        },
        error: () => this.toast.add({ severity:'error', summary:'Error', detail:'Delete failed' })
      })
    });
  }

  //for admin
  approveOrder(o: Order) {
    this.updateOrderStatus(o, 1); // 1 = Confirmed in backend enum
  }

  rejectOrder(o: Order) {
    this.confirm.confirm({
      message: `Are you sure you want to reject order ${o.orderNumber}?`,
      accept: () => this.updateOrderStatus(o, 5) // 5 = Cancelled in backend enum
    });
  }

  private updateOrderStatus(o: Order, newStatus: number) {
    // Map string order type back to enum integer for the backend request
    const orderTypeNum = ORDER_TYPE_OPTIONS.find(t => t.label === o.orderType)?.value ?? 0;

    const req: UpdateOrderRequest = {
      description: o.description,
      status: newStatus,
      orderType: orderTypeNum
    };

    this.orderService.update(o.id, req).subscribe({
      next: (updatedOrder) => { 
        const i = this.orders.findIndex(x => x.id === o.id);
        if (i !== -1) this.orders[i] = updatedOrder;
        this.orders = [...this.orders];
        this.refreshData(); // Update counts
        this.toast.add({ severity:'success', summary:'Success', detail:'Order status updated' }); 
      },
      error: () => this.toast.add({ severity:'error', summary:'Error', detail:'Failed to update status' })
    });
  }
}
