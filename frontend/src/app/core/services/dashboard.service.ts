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
