import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../enviroment/.env';
import { CategoriesResponse } from '../../features/categories/models/categories.model';
import { API_ENDPOINTS } from '../Constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly categoriesUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.categories.base}`;

  getCategoryById(categoryId: string): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(
      `${this.categoriesUrl}${API_ENDPOINTS.categories.getById}/${categoryId}`,
    );
  }
}
