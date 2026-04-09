import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { PRODUCT_COLORS, ProductColorOption } from '../../../../core/Constants/PRODUCT_COLORS';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ProductsService } from '../../../../core/services/products.service';
import { IProductCategoryOption } from '../../models/edit-product-model';
import { Category } from '../../../categories/models/categories.model';

type CreateProductForm = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<string>;
  category: FormControl<string>;
  mainImage: FormControl<File | null>;
  stock: FormControl<string>;
  color: FormControl<string>;
  imageGallery: FormControl<File[]>;
}>;

interface GalleryPreviewItem {
  id: string;
  name: string;
  previewUrl: string;
}

@Component({
  selector: 'app-create-product',
  standalone: false,
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);

  readonly productForm: CreateProductForm = this.fb.group({
    name: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control('', [Validators.required]),
    price: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/),
      Validators.min(0.01),
    ]),
    category: this.fb.nonNullable.control('', [Validators.required]),
    mainImage: this.fb.control<File | null>(null, [Validators.required]),
    stock: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.min(0),
    ]),
    color: this.fb.nonNullable.control('', [Validators.required]),
    imageGallery: this.fb.nonNullable.control<File[]>([]),
  });

  categoryOptions: IProductCategoryOption[] = [];
  galleryPreviewItems: GalleryPreviewItem[] = [];
  mainImagePreviewUrl: string | null = null;
  isLoadingCategories = false;
  categoriesErrorMessage = '';
  isSubmitting = false;
  submitErrorMessage = '';
  private galleryItemSequence = 0;

  ngOnInit(): void {
    this.loadCategoryOptions();
  }

  ngOnDestroy(): void {
    this.revokeMainImagePreview();
    this.revokeGalleryPreviews();
  }

  get nameControl(): FormControl<string> {
    return this.productForm.controls.name;
  }

  get descriptionControl(): FormControl<string> {
    return this.productForm.controls.description;
  }

  get priceControl(): FormControl<string> {
    return this.productForm.controls.price;
  }

  get categoryControl(): FormControl<string> {
    return this.productForm.controls.category;
  }

  get mainImageControl(): FormControl<File | null> {
    return this.productForm.controls.mainImage;
  }

  get stockControl(): FormControl<string> {
    return this.productForm.controls.stock;
  }

  get colorControl(): FormControl<string> {
    return this.productForm.controls.color;
  }

  get imageGalleryControl(): FormControl<File[]> {
    return this.productForm.controls.imageGallery;
  }

  get hasCategoryOptions(): boolean {
    return this.categoryOptions.length > 0;
  }

  onClose(): void {
    this.resetForm();
    this.closed.emit();
  }

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.revokeMainImagePreview();
    this.mainImagePreviewUrl = this.createPreviewUrl(file);
    this.mainImageControl.setValue(file);
    this.mainImageControl.markAsDirty();
    this.mainImageControl.markAsTouched();
    input.value = '';
  }

  onGalleryImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const nextPreviewItem = this.buildGalleryPreviewItem(file);
    this.galleryPreviewItems = [...this.galleryPreviewItems, nextPreviewItem];
    this.imageGalleryControl.setValue([...this.imageGalleryControl.value, file]);
    this.imageGalleryControl.markAsDirty();
    this.imageGalleryControl.markAsTouched();
    input.value = '';
  }

  removeGalleryImage(itemId: string): void {
    const galleryIndex = this.galleryPreviewItems.findIndex((item) => item.id === itemId);

    if (galleryIndex === -1) {
      return;
    }

    URL.revokeObjectURL(this.galleryPreviewItems[galleryIndex].previewUrl);

    this.galleryPreviewItems = this.galleryPreviewItems.filter((item) => item.id !== itemId);
    this.imageGalleryControl.setValue(
      this.imageGalleryControl.value.filter((_, index) => index !== galleryIndex),
    );
    this.imageGalleryControl.markAsDirty();
    this.imageGalleryControl.markAsTouched();
  }

  onGalleryImageReplaced(itemId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const galleryIndex = this.galleryPreviewItems.findIndex((item) => item.id === itemId);

    if (galleryIndex === -1) {
      input.value = '';
      return;
    }

    const nextPreviewItem = this.buildGalleryPreviewItem(file, itemId);
    URL.revokeObjectURL(this.galleryPreviewItems[galleryIndex].previewUrl);

    this.galleryPreviewItems = this.galleryPreviewItems.map((item, index) =>
      index === galleryIndex ? nextPreviewItem : item,
    );

    this.imageGalleryControl.setValue(
      this.imageGalleryControl.value.map((galleryFile, index) =>
        index === galleryIndex ? file : galleryFile,
      ),
    );
    this.imageGalleryControl.markAsDirty();
    this.imageGalleryControl.markAsTouched();
    input.value = '';
  }

  onCreateProduct(): void {
    if (this.productForm.invalid || this.isSubmitting) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.buildCreateProductPayload();

    if (!payload) {
      this.submitErrorMessage = 'Unable to prepare product data right now.';
      return;
    }

    this.isSubmitting = true;
    this.submitErrorMessage = '';

    this.productsService.addProduct(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.created.emit();
        this.onClose();
      },
      error: () => {
        this.isSubmitting = false;
        this.submitErrorMessage = 'Unable to create product right now. Please try again.';
      },
    });
  }

  hasError(control: AbstractControl | null, errorKey?: string): boolean {
    if (!control || !(control.touched || control.dirty)) {
      return false;
    }

    if (!errorKey) {
      return control.invalid;
    }

    return control.hasError(errorKey);
  }

  private loadCategoryOptions(): void {
    this.isLoadingCategories = true;
    this.categoriesErrorMessage = '';

    this.categoriesService
      .getCategories()
      .pipe(
        map((response) => this.buildUniqueCategoryOptions(response.data)),
        map((categoryOptions) =>
          categoryOptions
            .map((category) => ({
              label: category.name,
              value: category.id,
            }))
            .sort((first, second) => first.label.localeCompare(second.label)),
        ),
        catchError(() => {
          this.categoriesErrorMessage = 'Unable to load categories right now.';
          return of([] as IProductCategoryOption[]);
        }),
      )
      .subscribe((categoryOptions) => {
        this.categoryOptions = categoryOptions;
        this.isLoadingCategories = false;
      });
  }

  private buildUniqueCategoryOptions(categories: Category[]): Array<{ id: string; name: string }> {
    const uniqueCategories = new Map<string, { id: string; name: string }>();

    categories.forEach((category) => {
      const fallbackId = category.name.trim().toLowerCase();
      const key = category._id || fallbackId;

      if (!uniqueCategories.has(key)) {
        uniqueCategories.set(key, {
          id: category._id || fallbackId,
          name: category.name,
        });
      }
    });

    return [...uniqueCategories.values()];
  }

  private createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  private buildGalleryPreviewItem(file: File, id = `gallery-${this.galleryItemSequence++}`): GalleryPreviewItem {
    return {
      id,
      name: file.name,
      previewUrl: this.createPreviewUrl(file),
    };
  }

  private buildCreateProductPayload(): FormData | null {
    const formValue = this.productForm.getRawValue();
    const selectedColor = this.getSelectedColor(formValue.color);
    const mainImageFile = formValue.mainImage;

    if (!selectedColor || !mainImageFile) {
      return null;
    }

    const payload = new FormData();
    const variations = [
      {
        colorName: selectedColor.name,
        colorValue: selectedColor.hex,
        isDefault: true,
        stock: Number(formValue.stock),
      },
    ];

    payload.append('name', formValue.name.trim());
    payload.append('description', formValue.description.trim());
    payload.append('price', formValue.price);
    payload.append('category', formValue.category);
    payload.append('variations', JSON.stringify(variations));
    payload.append('variation_0_defaultImage', mainImageFile);

    formValue.imageGallery.forEach((file, index) => {
      payload.append(`variation_0_image_${index}`, file);
    });

    return payload;
  }

  private getSelectedColor(colorName: string): ProductColorOption | undefined {
    return PRODUCT_COLORS.find((color) => color.name === colorName);
  }

  private revokeMainImagePreview(): void {
    if (this.mainImagePreviewUrl) {
      URL.revokeObjectURL(this.mainImagePreviewUrl);
      this.mainImagePreviewUrl = null;
    }
  }

  private revokeGalleryPreviews(): void {
    this.galleryPreviewItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    this.galleryPreviewItems = [];
  }

  private resetForm(): void {
    this.revokeMainImagePreview();
    this.revokeGalleryPreviews();
    this.isSubmitting = false;
    this.submitErrorMessage = '';

    this.productForm.reset({
      name: '',
      description: '',
      price: '',
      category: '',
      mainImage: null,
      stock: '',
      color: '',
      imageGallery: [],
    });

    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
  }
}
