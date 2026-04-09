export interface ProductVariation {
  //defaultVariant:boolean
  colorName: string;
  colorValue: string;
  defaultImg: string;
  variantImages: string[];
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
