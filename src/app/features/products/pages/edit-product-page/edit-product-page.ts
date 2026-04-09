import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import {
  Product,
  ProductVariation,
} from '../../models/products.model';

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
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

  productForm: ProductForm = this.fb.group({
    basicInfo: this.fb.group({
      productName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
      description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
      category: this.fb.nonNullable.control('', [Validators.required]),
      price: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.pattern(POSITIVE_NUMBER_PATTERN),
      ]),
    }) as BasicInfoForm,
    variations: this.fb.array<VariationForm>([], { validators: [minimumVariations(1)] }),
    publishing: this.fb.group({
      visibility: this.fb.nonNullable.control(true),
      featured: this.fb.nonNullable.control(false),
      publishedDate: this.fb.nonNullable.control(''),
    }) as PublishingForm,
  });

  saveAttempted = false;
  isPageLoading = true;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  saveErrorMessage = '';
  deleteErrorMessage = '';

  confirmDeleteVariationOpen = false;
  pendingDeleteVariationId: string | null = null;

  categories: IProductCategoryOption[] = [];
  activeVariationId = '';
  productId = '';
  originalProduct: Product | null = null;

  confirmDeleteOpen = false;
  pendingDeleteImageId: string | null = null;

  confirmDeleteProductOpen = false;

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.productId) {
      this.errorMessage = 'Unable to find this product.';
      this.isPageLoading = false;
      return;
    }

    this.loadCategories();
    this.loadProduct();
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
    if (!this.originalProduct) {
      return;
    }

    this.saveAttempted = false;
    this.saveErrorMessage = '';
    this.deleteErrorMessage = '';
    this.closeDeleteVariationModal();
    this.closeDeleteModal();
    this.closeDeleteProductModal();
    this.populateForm(this.originalProduct);
  }

  onSave(): void {
    this.saveAttempted = true;
    this.saveErrorMessage = '';

    if (this.productForm.invalid || !this.productId || this.isSaving) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.buildUpdateFormData(false);

    if (!payload) {
      this.saveErrorMessage = 'Unable to prepare this product right now.';
      return;
    }

    this.isSaving = true;

    this.productsService.updateProductById(this.productId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.loadProduct();
      },
      error: () => {
        this.isSaving = false;
        this.saveErrorMessage = 'Unable to save product right now. Please try again.';
      },
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
        isDefault: this.variationsArray.length === 0,
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

  onMediaReplace(imageId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const activeVariationForm = this.findVariationForm(this.activeVariationId);

    if (!file || !activeVariationForm) {
      return;
    }

    const currentMedia = activeVariationForm.controls.media.value;
    const targetMedia = currentMedia.find((item) => item.id === imageId);

    if (!targetMedia) {
      input.value = '';
      return;
    }

    const nextMedia = this.createUploadedMediaItem(file, imageId, targetMedia.isDefault === true);
    const updatedMedia = currentMedia.map((item) => (item.id === imageId ? nextMedia : item));

    activeVariationForm.patchValue({
      image: nextMedia.isDefault ? nextMedia.image : activeVariationForm.controls.image.value,
      media: updatedMedia,
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

  openDeleteProductModal(): void {
    this.deleteErrorMessage = '';
    this.confirmDeleteProductOpen = true;
  }

  closeDeleteProductModal(): void {
    this.confirmDeleteProductOpen = false;
  }

  confirmDeleteProduct(): void {
    if (!this.productId || !this.originalProduct || this.isDeleting) {
      return;
    }

    const payload = this.buildOriginalProductDeleteFormData(this.originalProduct, true);
    this.isDeleting = true;
    this.deleteErrorMessage = '';

    this.productsService.updateProductById(this.productId, payload).subscribe({
      next: () => {
        this.isDeleting = false;
        this.confirmDeleteProductOpen = false;
        this.router.navigate(['/products']);
      },
      error: () => {
        this.isDeleting = false;
        this.deleteErrorMessage = 'Unable to delete product right now. Please try again.';
      },
    });
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        const uniqueCategories = new Map<string, IProductCategoryOption>();

        response.data.forEach((category) => {
          const fallbackId = category.name.trim().toLowerCase();
          const key = category._id || fallbackId;

          if (!uniqueCategories.has(key)) {
            uniqueCategories.set(key, {
              label: category.name,
              value: category._id || fallbackId,
            });
          }
        });

        this.categories = [...uniqueCategories.values()].sort((first, second) =>
          first.label.localeCompare(second.label),
        );
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  private loadProduct(): void {
    if (!this.productId) {
      return;
    }

    this.isPageLoading = true;
    this.errorMessage = '';
    this.saveErrorMessage = '';

    this.productsService.getProductById(this.productId).subscribe({
      next: (response) => {
        const product = response.data[0];

        if (!product) {
          this.errorMessage = 'Unable to find this product.';
          this.isPageLoading = false;
          return;
        }

        this.originalProduct = product;
        this.populateForm(product);
        this.isPageLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load product right now. Please try again.';
        this.isPageLoading = false;
      },
    });
  }

  private populateForm(product: Product): void {
    const normalizedVariations = this.mapProductVariations(product);

    this.basicInfoForm.patchValue({
      productName: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
    });

    this.publishingForm.patchValue({
      visibility: product.visible,
      featured: product.featured,
      publishedDate: this.formatPublishedDate(product.createdAt),
    });

    this.setVariations(normalizedVariations);
    this.activeVariationId =
      normalizedVariations.find((variation) => variation.isDefault)?.id ?? normalizedVariations[0]?.id ?? '';
    this.saveAttempted = false;
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
  }

  private setVariations(variations: IProductVariation[]): void {
    this.variationsArray.clear();

    variations.forEach((variation) => {
      this.variationsArray.push(this.createVariationForm(variation));
    });

    this.variationsArray.updateValueAndValidity();
  }

  private mapProductVariations(product: Product): IProductVariation[] {
    if (!product.variations.length) {
      const fallbackColor = PRODUCT_COLORS[0];
      return [
        {
          id: `${product._id}-variation-0`,
          name: fallbackColor.name,
          colorName: fallbackColor.name,
          colorHex: fallbackColor.hex,
          stock: product.stock,
          stockInput: product.stock.toString(),
          image: product.image || DEFAULT_PRODUCT_IMAGE,
          isDefault: true,
          media: [
            {
              id: `${product._id}-default-media`,
              image: product.image || DEFAULT_PRODUCT_IMAGE,
              isDefault: true,
              persisted: true,
              file: null,
            },
          ],
        },
      ];
    }

    let defaultAssigned = false;

    const variations = product.variations.map((variation, index) => {
      const isDefault = variation.isDefault === true && !defaultAssigned;
      if (isDefault) {
        defaultAssigned = true;
      }

      const defaultImage = variation.defaultImage || variation.defaultImg || product.image || DEFAULT_PRODUCT_IMAGE;
      const galleryImages = (variation.variationImgs ?? variation.variantImages ?? []).filter(
        (image) => image && image !== defaultImage,
      );
      const media: IProductMediaItem[] = [
        {
          id: `${variation._id ?? product._id}-${index}-default`,
          image: defaultImage,
          isDefault: true,
          persisted: true,
          file: null,
        },
        ...galleryImages.map((image, imageIndex) => ({
          id: `${variation._id ?? product._id}-${index}-media-${imageIndex}`,
          image,
          isDefault: false,
          persisted: true,
          file: null,
        })),
      ];

      return {
        id: variation._id ?? `${product._id}-variation-${index}`,
        name: variation.colorName,
        colorName: variation.colorName,
        colorHex: variation.colorValue,
        stock: variation.stock,
        stockInput: variation.stock.toString(),
        image: defaultImage,
        isDefault,
        media,
      };
    });

    if (!variations.some((variation) => variation.isDefault) && variations.length) {
      variations[0].isDefault = true;
    }

    return variations;
  }

  private buildUpdateFormData(isDeleted: boolean): FormData | null {
    if (this.productForm.invalid) {
      return null;
    }

    const basicInfo = this.basicInfoForm.getRawValue();
    const publishing = this.publishingForm.getRawValue();
    const payload = new FormData();

    payload.append('name', basicInfo.productName.trim());
    payload.append('description', basicInfo.description.trim());
    payload.append('price', basicInfo.price);
    payload.append('category', basicInfo.category);
    payload.append('featured', String(publishing.featured));
    payload.append('visible', String(publishing.visibility));
    payload.append('isDeleted', String(isDeleted));

    payload.append(
      'variations',
      JSON.stringify(
        this.variations.map((variation, variationIndex) =>
          this.mapVariationToUpdatePayload(variation, variationIndex, payload),
        ),
      ),
    );

    return payload;
  }

  private buildOriginalProductDeleteFormData(product: Product, isDeleted: boolean): FormData {
    const payload = new FormData();

    payload.append('name', product.name);
    payload.append('description', product.description);
    payload.append('price', product.price.toString());
    payload.append('category', product.category);
    payload.append('featured', String(product.featured));
    payload.append('visible', String(product.visible));
    payload.append('isDeleted', String(isDeleted));
    payload.append(
      'variations',
      JSON.stringify(
        this.normalizeProductVariations(product.variations, product.image).map((variation) => ({
          colorName: variation.colorName,
          colorValue: variation.colorValue,
          defaultImage: variation.defaultImage || variation.defaultImg || product.image || DEFAULT_PRODUCT_IMAGE,
          variationImgs: variation.variationImgs ?? variation.variantImages ?? [],
          isDefault: variation.isDefault === true,
          stock: variation.stock,
        })),
      ),
    );

    return payload;
  }

  private normalizeProductVariations(
    variations: ProductVariation[],
    fallbackImage: string,
  ): ProductVariation[] {
    if (!variations.length) {
      return [
        {
          colorName: PRODUCT_COLORS[0].name,
          colorValue: PRODUCT_COLORS[0].hex,
          defaultImage: fallbackImage || DEFAULT_PRODUCT_IMAGE,
          variationImgs: [],
          isDefault: true,
          stock: 0,
        },
      ];
    }

    const hasExplicitDefault = variations.some((variation) => variation.isDefault === true);

    return variations.map((variation, index) => ({
      ...variation,
      defaultImage: variation.defaultImage || variation.defaultImg || fallbackImage || DEFAULT_PRODUCT_IMAGE,
      variationImgs: variation.variationImgs ?? variation.variantImages ?? [],
      isDefault: hasExplicitDefault ? variation.isDefault === true : index === 0,
    }));
  }

  private mapVariationToUpdatePayload(
    variation: IProductVariation,
    variationIndex: number,
    payload: FormData,
  ): Record<string, unknown> {
    const defaultMedia = variation.media.find((mediaItem) => mediaItem.isDefault) ?? variation.media[0];
    const existingGalleryImages = variation.media
      .filter((mediaItem) => mediaItem.id !== defaultMedia?.id && !mediaItem.file)
      .map((mediaItem) => mediaItem.image);
    const newGalleryFiles = variation.media.filter(
      (mediaItem) => mediaItem.id !== defaultMedia?.id && !!mediaItem.file,
    );

    if (defaultMedia?.file) {
      payload.append(`variation_${variationIndex}_defaultImage`, defaultMedia.file);
    }

    newGalleryFiles.forEach((mediaItem, imageIndex) => {
      if (mediaItem.file) {
        payload.append(`variation_${variationIndex}_image_${imageIndex}`, mediaItem.file);
      }
    });

    return {
      colorName: variation.colorName,
      colorValue: variation.colorHex,
      ...(defaultMedia && !defaultMedia.file ? { defaultImage: defaultMedia.image } : {}),
      variationImgs: existingGalleryImages,
      isDefault: variation.isDefault,
      stock: Number(variation.stockInput),
    };
  }

  private formatPublishedDate(dateValue: string): string {
    if (!dateValue) {
      return '';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateValue));
  }

  private createDefaultMediaItem(variationId: string): IProductMediaItem {
    return {
      id: `${variationId}-default-media`,
      image: DEFAULT_PRODUCT_IMAGE,
      isDefault: true,
      persisted: true,
      file: null,
    };
  }

  private createLocalPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  private createUploadedMediaItem(
    file: File,
    id = `media-${Date.now()}`,
    isDefault = true,
  ): IProductMediaItem {
    return {
      id,
      image: this.createLocalPreviewUrl(file),
      isDefault,
      persisted: false,
      file,
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
