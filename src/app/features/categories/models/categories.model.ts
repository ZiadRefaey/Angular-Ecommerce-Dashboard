export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
}

export interface CreateCategoryPayload {
  name: string;
}

export interface CategoryListItem {
  id: string;
  name: string;
  productsCount: number;
  createdAt: string;
}
export interface CategoryStatsCard {
  iconClass: string;
  iconWrapperClass: string;
  title: string;
  value: string;
}
