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
  templateUrl: './order-list.component.html'
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
