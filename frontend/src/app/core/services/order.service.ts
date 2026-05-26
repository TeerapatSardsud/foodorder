import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  getAll(): Observable<Order[]>                              { return this.http.get<Order[]>(this.baseUrl); }
  getById(id: number): Observable<Order>                    { return this.http.get<Order>(`${this.baseUrl}/${id}`); }
  create(r: CreateOrderRequest): Observable<Order>          { return this.http.post<Order>(this.baseUrl, r); }
  update(id: number, r: UpdateOrderRequest): Observable<Order> { return this.http.put<Order>(`${this.baseUrl}/${id}`, r); }
  delete(id: number): Observable<void>                      { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
