import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuItemService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/menuitems`;

  getAll(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.baseUrl);
  }
}
