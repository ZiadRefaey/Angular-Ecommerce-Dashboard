import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  IProductCategoryOption,
  IProductMediaItem,
  IProductVariation,
} from '../../models/edit-product-model';
import { PRODUCT_COLORS } from '../../../../core/Constants/PRODUCT_COLORS';

const DEFAULT_PRODUCT_IMAGE = '/product-media.jpg';
const POSITIVE_NUMBER_PATTERN = /^[1-9]\d*(\.\d+)?$/;

const minimumVariations = (minimum: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const totalVariations = control instanceof FormArray ? control.length : 0;

    return totalVariations >= minimum
      ? null
      : {
          minimumVariations: {
            requiredLength: minimum,
            actualLength: totalVariations,
          },
        };
  };
};

type BasicInfoForm = FormGroup<{
  productName: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<string>;
  price: FormControl<string>;
}>;

type VariationForm = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  colorName: FormControl<string>;
  colorHex: FormControl<string>;
  stock: FormControl<number>;
  stockInput: FormControl<string>;
  image: FormControl<string>;
  isDefault: FormControl<boolean>;
  media: FormControl<IProductMediaItem[]>;
}>;

type PublishingForm = FormGroup<{
  visibility: FormControl<boolean>;
  featured: FormControl<boolean>;
  publishedDate: FormControl<string>;
}>;

type ProductForm = FormGroup<{
  basicInfo: BasicInfoForm;
  variations: FormArray<VariationForm>;
  publishing: PublishingForm;
}>;

@Component({
  selector: 'app-edit-product-page',
  standalone: false,
  templateUrl: './edit-product-page.html',
  styleUrl: './edit-product-page.css',
})
export class EditProductPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  productForm: ProductForm;
  saveAttempted = false;

  confirmDeleteVariationOpen = false;
  pendingDeleteVariationId: string | null = null;

  categories: IProductCategoryOption[] = [
    { label: 'Monitors', value: 'monitors' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Audio', value: 'audio' },
    { label: 'Gaming', value: 'gaming' },
  ];

  activeVariationId = 'var-black';

  confirmDeleteOpen = false;
  pendingDeleteImageId: string | null = null;

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      return;
    }

    this.productsService.getProductById(productId).subscribe({
      next: (product) => {
        console.log(product);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      basicInfo: this.fb.group({
        productName: this.fb.nonNullable.control('UltraVision Pro 4K Monitor', [
          Validators.required,
          Validators.minLength(3),
        ]),
        description: this.fb.nonNullable.control(
          'The UltraVision Pro 4K Monitor delivers stunning visual clarity with 3840 × 2160 resolution. Featuring HDR10 support, 99% sRGB color gamut coverage, and a sleek edge-to-edge design. Perfect for creative professionals and high-end workstations.',
          [Validators.required, Validators.minLength(6)],
        ),
        category: this.fb.nonNullable.control('monitors', [Validators.required]),
        price: this.fb.nonNullable.control('12499.99', [
          Validators.required,
          Validators.pattern(POSITIVE_NUMBER_PATTERN),
        ]),
      }),
      variations: this.fb.array(
        [
          this.createVariationForm({
            id: 'var-black',
            name: 'Black',
            colorName: 'Black',
            colorHex: '#000000',
            stock: 30,
            stockInput: '30',
            image: DEFAULT_PRODUCT_IMAGE,
            isDefault: true,
            media: [this.createDefaultMediaItem('var-black')],
          }),
          this.createVariationForm({
            id: 'var-grey',
            name: 'Gray',
            colorName: 'Gray',
            colorHex: '#9CA3AF',
            stock: 15,
            stockInput: '15',
            image: DEFAULT_PRODUCT_IMAGE,
            isDefault: false,
            media: [this.createDefaultMediaItem('var-grey')],
          }),
        ],
        { validators: [minimumVariations(1)] },
      ),
      publishing: this.fb.group({
        visibility: this.fb.nonNullable.control(true),
        featured: this.fb.nonNullable.control(false),
        publishedDate: this.fb.nonNullable.control('Aug 24, 2024'),
      }),
    });
  }

  get basicInfoForm(): BasicInfoForm {
    return this.productForm.controls.basicInfo;
  }

  get publishingForm(): PublishingForm {
    return this.productForm.controls.publishing;
  }

  get variationsArray(): FormArray<VariationForm> {
    return this.productForm.controls.variations;
  }

  get variationFormGroups(): VariationForm[] {
    return this.variationsArray.controls;
  }

  get variations(): IProductVariation[] {
    return this.variationsArray.getRawValue();
  }

  get activeVariation(): IProductVariation | undefined {
    return this.variations.find((variation) => variation.id === this.activeVariationId);
  }

  get totalVariationStock(): number {
    return this.variations.reduce(
      (total, variation) => total + (Number.isFinite(variation.stock) ? variation.stock : 0),
      0,
    );
  }

  onCancel(): void {
    console.log('Cancel edit');
  }

  onSave(): void {
    this.saveAttempted = true;

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

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
    this.variationFormGroups.forEach((variationForm) => {
      variationForm.controls.isDefault.setValue(variationForm.controls.id.value === variationId);
    });
  }

  onAddVariation(): void {
    const nextId = `var-${Date.now()}`;
    const selectedColorNames = new Set(this.variations.map((variation) => variation.colorName));
    const nextColor =
      PRODUCT_COLORS.find((color) => !selectedColorNames.has(color.name)) ?? PRODUCT_COLORS[0];

    this.variationsArray.push(
      this.createVariationForm({
        id: nextId,
        name: nextColor.name,
        colorName: nextColor.name,
        colorHex: nextColor.hex,
        stock: Number.NaN,
        stockInput: '',
        image: DEFAULT_PRODUCT_IMAGE,
        isDefault: false,
        media: [this.createDefaultMediaItem(nextId)],
      }),
    );
    this.variationsArray.updateValueAndValidity();
    this.activeVariationId = nextId;
  }

  onMediaUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const activeVariationForm = this.findVariationForm(this.activeVariationId);

    if (!file || !activeVariationForm) {
      return;
    }

    const nextMedia = this.createUploadedMediaItem(file);
    const normalizedMedia = activeVariationForm.controls.media.value.map((item) => ({
      ...item,
      isDefault: false,
    }));

    activeVariationForm.patchValue({
      image: nextMedia.image,
      media: [...normalizedMedia, nextMedia],
    });

    input.value = '';
  }

  onMediaSelect(imageId: string): void {
    const activeVariationForm = this.findVariationForm(this.activeVariationId);

    if (!activeVariationForm) {
      return;
    }

    const updatedMedia = activeVariationForm.controls.media.value.map((item) => ({
      ...item,
      isDefault: item.id === imageId,
    }));
    const defaultItem = updatedMedia.find((item) => item.id === imageId);

    activeVariationForm.patchValue({
      image: defaultItem?.image ?? activeVariationForm.controls.image.value,
      media: updatedMedia,
    });
  }

  requestDeleteMedia(imageId: string): void {
    if ((this.activeVariation?.media.length ?? 0) <= 1) {
      return;
    }

    this.pendingDeleteImageId = imageId;
    this.confirmDeleteOpen = true;
  }

  closeDeleteModal(): void {
    this.confirmDeleteOpen = false;
    this.pendingDeleteImageId = null;
  }

  confirmDeleteMedia(): void {
    const activeVariationForm = this.findVariationForm(this.activeVariationId);

    if (!this.pendingDeleteImageId || !activeVariationForm) {
      this.closeDeleteModal();
      return;
    }

    const remainingMedia = activeVariationForm.controls.media.value.filter(
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

    activeVariationForm.patchValue({
      image: nextDefault?.image ?? activeVariationForm.controls.image.value,
      media: normalizedMedia,
    });

    this.closeDeleteModal();
  }

  requestDeleteVariation(variationId: string): void {
    if (this.variationsArray.length === 1) {
      return;
    }

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
    const deletedVariationIndex = this.variationFormGroups.findIndex(
      (variationForm) => variationForm.controls.id.value === deletedVariationId,
    );

    if (deletedVariationIndex === -1) {
      this.closeDeleteVariationModal();
      return;
    }

    this.variationsArray.removeAt(deletedVariationIndex);
    this.variationsArray.updateValueAndValidity();

    if (
      this.variationFormGroups.length > 0 &&
      !this.variations.some((variation) => variation.isDefault)
    ) {
      this.variationFormGroups[0].controls.isDefault.setValue(true);
    }

    if (this.activeVariationId === deletedVariationId) {
      this.activeVariationId = this.variations[0]?.id ?? '';
    }

    this.closeDeleteVariationModal();
  }

  private createDefaultMediaItem(variationId: string): IProductMediaItem {
    return {
      id: `${variationId}-default-media`,
      image: DEFAULT_PRODUCT_IMAGE,
      isDefault: true,
    };
  }

  private createLocalPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  private createUploadedMediaItem(file: File): IProductMediaItem {
    return {
      id: `media-${Date.now()}`,
      image: this.createLocalPreviewUrl(file),
      isDefault: true,
    };
  }

  private createVariationForm(variation: IProductVariation): VariationForm {
    return this.fb.group({
      id: this.fb.nonNullable.control(variation.id),
      name: this.fb.nonNullable.control(variation.name),
      colorName: this.fb.nonNullable.control(variation.colorName, [Validators.required]),
      colorHex: this.fb.nonNullable.control(variation.colorHex),
      stock: this.fb.nonNullable.control(variation.stock),
      stockInput: this.fb.nonNullable.control(variation.stockInput, [
        Validators.required,
        Validators.pattern(POSITIVE_NUMBER_PATTERN),
      ]),
      image: this.fb.nonNullable.control(variation.image),
      isDefault: this.fb.nonNullable.control(variation.isDefault),
      media: this.fb.nonNullable.control(variation.media),
    });
  }

  private findVariationForm(variationId: string): VariationForm | undefined {
    return this.variationFormGroups.find(
      (variationForm) => variationForm.controls.id.value === variationId,
    );
  }
}






