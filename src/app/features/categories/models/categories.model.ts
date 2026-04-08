export type CategoryStatus = 'ACTIVE' | 'DRAFT';

export interface Category {
  _id: string;
  name: string;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
}

export interface CategoryListItem {
  id: number;
  name: string;
  productsCount: number;
  status: CategoryStatus;
  createdAt: string;
}
export interface CategoryStatsCard {
  iconClass: string;
  iconWrapperClass: string;
  title: string;
  value: string;
}
