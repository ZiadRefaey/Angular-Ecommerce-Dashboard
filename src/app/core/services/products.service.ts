import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../enviroment/.env';
import { API_ENDPOINTS } from '../Constants/api-endpoints';
import { ProductsResponse } from '../../features/products/models/products.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly productsUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.products.base}`;

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.productsUrl}${API_ENDPOINTS.products.getAll}`);
  }
}
