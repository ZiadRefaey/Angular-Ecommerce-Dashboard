export type ProductCategory = 'AUDIO' | 'MOBILE' | 'COMPUTING';
export type ProductStockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Product {
  id: number;
  image: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stockStatus: ProductStockStatus;
  stockLabel: string;
}
export interface ProductStatsCard {
  iconClass: string;
  iconWrapperClass: string;
  title: string;
  value: string;
}
