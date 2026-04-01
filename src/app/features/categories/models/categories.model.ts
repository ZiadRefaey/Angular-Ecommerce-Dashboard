export type CategoryStatus = 'ACTIVE' | 'DRAFT';

export interface Category {
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
