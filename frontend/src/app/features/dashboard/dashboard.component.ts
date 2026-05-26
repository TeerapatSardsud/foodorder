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
