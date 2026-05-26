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
