export interface ProductVariation {
  colorName: string;
  colorValue: string;
  defaultImage?: string;
  defaultImg?: string;
  variationImgs?: string[];
  variantImages?: string[];
  isDefault?: boolean;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  featured: boolean;
  visible: boolean;
  isDeleted?: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  variations: ProductVariation[];
}

export interface ProductsResponse {
  message: string;
  data: Product[];
}

export interface CreateProductVariationPayload {
  colorName: string;
  colorValue: string;
  defaultImage: string;
  variationImgs: string[];
  isDefault: true;
  stock: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  variations: CreateProductVariationPayload[];
}

export interface CreateProductResponse {
  message: string;
  data?: Product;
}
