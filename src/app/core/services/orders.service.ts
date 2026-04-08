import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../enviroment/.env';
import { API_ENDPOINTS } from '../Constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.orders.base}`;

  getOrders<T>(): Observable<T> {
    return this.http.get<T>(this.ordersUrl);
  }
}
