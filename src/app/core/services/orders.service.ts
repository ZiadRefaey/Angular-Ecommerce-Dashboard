import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../enviroment/.env';
import { API_ENDPOINTS } from '../Constants/api-endpoints';
import {
  OrderByIdResponse,
  OrdersResponse,
  UpdateOrderStatus,
} from '../../features/orders/models/orders.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.orders.base}`;

  getAllOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.ordersUrl}${API_ENDPOINTS.orders.getAll}`);
  }

  getOrderById(orderId: string): Observable<OrderByIdResponse> {
    return this.http.get<OrderByIdResponse>(
      `${this.ordersUrl}${API_ENDPOINTS.orders.getById}/${orderId}`,
    );
  }

  updateOrderStatus(
    orderId: string,
    payload: { status: UpdateOrderStatus },
  ): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.ordersUrl}${API_ENDPOINTS.orders.updateStatus}/${orderId}`,
      payload,
    );
  }
}
