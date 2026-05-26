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
  templateUrl: './dashboard.component.html'
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
