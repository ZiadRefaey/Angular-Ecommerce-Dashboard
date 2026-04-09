import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../enviroment/.env';
import { API_ENDPOINTS } from '../Constants/api-endpoints';
import { OrdersResponse } from '../../features/orders/models/orders.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.orders.base}`;

  getAllOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.ordersUrl}${API_ENDPOINTS.orders.getAll}`);
  }
}
