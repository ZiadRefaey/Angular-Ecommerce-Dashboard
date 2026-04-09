export interface IProductMediaItem {
  id: string;
  image: string;
  isDefault?: boolean;
  file?: File | null;
  persisted?: boolean;
}

export interface IProductVariation {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  stock: number;
  stockInput: string;
  image: string;
  isDefault: boolean;
  media: IProductMediaItem[];
}

export interface IProductCategoryOption {
  label: string;
  value: string;
}
