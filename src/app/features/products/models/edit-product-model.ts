export interface IProductMediaItem {
  id: string;
  image: string;
  isDefault?: boolean;
}

export interface IProductVariation {
  id: string;
  name: string;
  sku: string;
  priceAdjustment: number;
  stock: number;
  image: string;
  isDefault: boolean;
  media: IProductMediaItem[];
}

export interface IProductCategoryOption {
  label: string;
  value: string;
}
