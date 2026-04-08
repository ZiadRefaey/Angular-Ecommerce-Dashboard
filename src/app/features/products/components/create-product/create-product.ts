import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError, map, of, switchMap } from 'rxjs';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ProductsService } from '../../../../core/services/products.service';
import { IProductCategoryOption } from '../../models/edit-product-model';

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

  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

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

    const nextPreviewItem: GalleryPreviewItem = {
      id: `gallery-${Date.now()}`,
      name: file.name,
      previewUrl: this.createPreviewUrl(file),
    };

    this.galleryPreviewItems = [...this.galleryPreviewItems, nextPreviewItem];
    this.imageGalleryControl.setValue([...this.imageGalleryControl.value, file]);
    this.imageGalleryControl.markAsDirty();
    input.value = '';
  }

  onCreateProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue();

    console.log('Create product', {
      ...formValue,
      mainImageName: formValue.mainImage?.name ?? null,
      galleryImageNames: formValue.imageGallery.map((file) => file.name),
    });

    this.onClose();
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

    this.productsService
      .getProducts()
      .pipe(
        map((response) => response.data.map((product) => product.category)),
        switchMap((categoryIds) => this.categoriesService.getCategoriesByIds(categoryIds)),
        map((categories) =>
          categories
            .map((category) => ({
              label: category.name,
              value: category._id,
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

  private createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
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
