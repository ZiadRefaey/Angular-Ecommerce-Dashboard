import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { env } from '../../../enviroment/.env';
import { Category, CategoriesResponse } from '../../features/categories/models/categories.model';
import { API_ENDPOINTS } from '../Constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly categoriesUrl = `${env.apiBaseUrl}/api${API_ENDPOINTS.categories.base}`;

  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(
      `${this.categoriesUrl}${API_ENDPOINTS.categories.getAll}`,
    );
  }

  getCategoryById(categoryId: string): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(
      `${this.categoriesUrl}${API_ENDPOINTS.categories.getById}/${categoryId}`,
    );
  }

  getCategoriesByIds(categoryIds: string[]): Observable<Category[]> {
    const uniqueCategoryIds = [...new Set(categoryIds.filter(Boolean))];

    if (!uniqueCategoryIds.length) {
      return of([]);
    }

    return forkJoin(uniqueCategoryIds.map((categoryId) => this.getCategoryById(categoryId))).pipe(
      map((responses) =>
        responses
          .map((response) => response.data[0])
          .filter((category): category is Category => !!category),
      ),
    );
  }
}
