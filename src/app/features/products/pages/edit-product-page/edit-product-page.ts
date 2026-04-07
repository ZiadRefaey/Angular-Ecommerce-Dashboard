import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IProductCategoryOption,
  IProductMediaItem,
  IProductVariation,
} from '../../models/edit-product-model';
import { PRODUCT_COLORS } from '../../../../core/Constants/PRODUCT_COLORS';
type BasicInfoForm = FormGroup<{
  productName: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<string>;
  price: FormControl<number>;
}>;
type PublishingForm = FormGroup<{
  visibility: FormControl<boolean>;
  featured: FormControl<boolean>;
  publishedDate: FormControl<string>;
}>;
@Component({
  selector: 'app-edit-product-page',
  standalone: false,
  templateUrl: './edit-product-page.html',
  styleUrl: './edit-product-page.css',
})
export class EditProductPage {
  basicInfoForm: BasicInfoForm;
  publishingForm: PublishingForm;

  confirmDeleteVariationOpen = false;
  pendingDeleteVariationId: string | null = null;

  categories: IProductCategoryOption[] = [
    { label: 'Monitors', value: 'monitors' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Audio', value: 'audio' },
    { label: 'Gaming', value: 'gaming' },
  ];

  variations: IProductVariation[] = [
    {
      id: 'var-black',
      name: 'Black',
      colorName: 'Black',
      colorHex: '#000000',
      stock: 30,
      image: 'assets/products/variations/black-main.jpg',
      isDefault: true,
      media: [
        {
          id: 'blk-1',
          image: 'assets/products/variations/black-main.jpg',
          isDefault: true,
        },
        {
          id: 'blk-2',
          image: 'assets/products/variations/black-side.jpg',
        },
        {
          id: 'blk-3',
          image: 'assets/products/variations/black-detail.jpg',
        },
        {
          id: 'blk-4',
          image: 'assets/products/variations/black-alt.jpg',
        },
      ],
    },
    {
      id: 'var-grey',
      name: 'Gray',
      colorName: 'Gray',
      colorHex: '#9CA3AF',
      stock: 15,
      image: 'assets/products/variations/grey-main.jpg',
      isDefault: false,
      media: [
        {
          id: 'gry-1',
          image: 'assets/products/variations/grey-main.jpg',
          isDefault: true,
        },
        {
          id: 'gry-2',
          image: 'assets/products/variations/grey-side.jpg',
        },
      ],
    },
  ];

  activeVariationId = 'var-black';

  confirmDeleteOpen = false;
  pendingDeleteImageId: string | null = null;

  get activeVariation(): IProductVariation | undefined {
    return this.variations.find((variation) => variation.id === this.activeVariationId);
  }

  get totalVariationStock(): number {
    return this.variations.reduce((total, variation) => total + variation.stock, 0);
  }

  constructor(private fb: FormBuilder) {
    this.basicInfoForm = this.fb.group({
      productName: this.fb.nonNullable.control('UltraVision Pro 4K Monitor', [Validators.required]),
      description: this.fb.nonNullable.control(
        'The UltraVision Pro 4K Monitor delivers stunning visual clarity with 3840 × 2160 resolution. Featuring HDR10 support, 99% sRGB color gamut coverage, and a sleek edge-to-edge design. Perfect for creative professionals and high-end workstations.',
        [Validators.required],
      ),
      category: this.fb.nonNullable.control('monitors', [Validators.required]),
      price: this.fb.nonNullable.control(12499.99, [Validators.required]),
    });

    this.publishingForm = this.fb.group({
      visibility: this.fb.nonNullable.control(true),
      featured: this.fb.nonNullable.control(false),
      publishedDate: this.fb.nonNullable.control('Aug 24, 2024'),
    });
  }

  onCancel(): void {
    console.log('Cancel edit');
  }

  onSave(): void {
    console.log('Save product', {
      basicInfo: this.basicInfoForm.getRawValue(),
      publishing: this.publishingForm.getRawValue(),
      variations: this.variations,
    });
  }

  onVariationMediaEdit(variationId: string): void {
    this.activeVariationId = variationId;
  }

  onVariationDefault(variationId: string): void {
    this.variations = this.variations.map((variation) => ({
      ...variation,
      isDefault: variation.id === variationId,
    }));
  }

  onVariationUpdate(updatedVariation: IProductVariation): void {
    this.variations = this.variations.map((variation) =>
      variation.id === updatedVariation.id ? updatedVariation : variation,
    );
  }

  onAddVariation(): void {
    const nextId = `var-${Date.now()}`;
    const selectedColorNames = new Set(this.variations.map((variation) => variation.colorName));
    const nextColor =
      PRODUCT_COLORS.find((color) => !selectedColorNames.has(color.name)) ?? PRODUCT_COLORS[0];
    const newVariation: IProductVariation = {
      id: nextId,
      name: nextColor.name,
      colorName: nextColor.name,
      colorHex: nextColor.hex,
      stock: 0,
      image: 'assets/products/variations/placeholder.jpg',
      isDefault: false,
      media: [
        {
          id: `${nextId}-media-1`,
          image: 'assets/products/variations/placeholder.jpg',
          isDefault: true,
        },
      ],
    };

    this.variations = [...this.variations, newVariation];
    this.activeVariationId = newVariation.id;
  }

  onMediaUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.activeVariation) return;

    const fakeUrl = URL.createObjectURL(file);

    const nextMedia: IProductMediaItem = {
      id: `media-${Date.now()}`,
      image: fakeUrl,
      isDefault: false,
    };

    this.variations = this.variations.map((variation) =>
      variation.id === this.activeVariationId
        ? {
            ...variation,
            media: [...variation.media, nextMedia],
          }
        : variation,
    );
  }

  onMediaSelect(imageId: string): void {
    this.variations = this.variations.map((variation) => {
      if (variation.id !== this.activeVariationId) return variation;

      const updatedMedia = variation.media.map((item) => ({
        ...item,
        isDefault: item.id === imageId,
      }));

      const defaultItem = updatedMedia.find((item) => item.id === imageId);

      return {
        ...variation,
        image: defaultItem?.image ?? variation.image,
        media: updatedMedia,
      };
    });
  }

  requestDeleteMedia(imageId: string): void {
    if (this.variations.length === 1) return;
    this.pendingDeleteImageId = imageId;
    this.confirmDeleteOpen = true;
  }

  closeDeleteModal(): void {
    this.confirmDeleteOpen = false;
    this.pendingDeleteImageId = null;
  }

  confirmDeleteMedia(): void {
    if (!this.pendingDeleteImageId || !this.activeVariation) {
      this.closeDeleteModal();
      return;
    }

    this.variations = this.variations.map((variation) => {
      if (variation.id !== this.activeVariationId) return variation;

      const remainingMedia = variation.media.filter(
        (item) => item.id !== this.pendingDeleteImageId,
      );

      const hasDefault = remainingMedia.some((item) => item.isDefault);
      const normalizedMedia = hasDefault
        ? remainingMedia
        : remainingMedia.map((item, index) => ({
            ...item,
            isDefault: index === 0,
          }));

      const nextDefault = normalizedMedia.find((item) => item.isDefault);

      return {
        ...variation,
        image: nextDefault?.image ?? variation.image,
        media: normalizedMedia,
      };
    });

    this.closeDeleteModal();
  }
  requestDeleteVariation(variationId: string): void {
    this.pendingDeleteVariationId = variationId;
    this.confirmDeleteVariationOpen = true;
  }

  closeDeleteVariationModal(): void {
    this.confirmDeleteVariationOpen = false;
    this.pendingDeleteVariationId = null;
  }

  confirmDeleteVariation(): void {
    if (!this.pendingDeleteVariationId) {
      this.closeDeleteVariationModal();
      return;
    }

    const deletedVariationId = this.pendingDeleteVariationId;
    const remainingVariations = this.variations.filter(
      (variation) => variation.id !== deletedVariationId,
    );

    if (remainingVariations.length > 0 && !remainingVariations.some((v) => v.isDefault)) {
      remainingVariations[0] = {
        ...remainingVariations[0],
        isDefault: true,
      };
    }

    this.variations = remainingVariations;

    if (this.activeVariationId === deletedVariationId) {
      this.activeVariationId = this.variations[0]?.id ?? '';
    }

    this.closeDeleteVariationModal();
  }
}
