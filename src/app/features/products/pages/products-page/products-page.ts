import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';
import { ProductStatsCard } from '../../../dashboard/models/product.model';
import { Product, ProductVariation } from '../../models/products.model';
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Category } from '../../../categories/models/categories.model';
import { ProductCategoryOption } from '../../components/products-filters/products-filters';

type ProductStockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

  columns: DataTableColumn[] = [
    { field: 'image', header: 'IMAGE', width: '12%' },
    { field: 'name', header: 'PRODUCT NAME', width: '30%' },
    { field: 'category', header: 'CATEGORY', width: '16%' },
    { field: 'price', header: 'PRICE', width: '14%' },
    { field: 'stockStatus', header: 'STOCK STATUS', width: '18%' },
    {
      field: 'actions',
      header: 'ACTIONS',
      width: '10%',
      headerAlign: 'center',
      bodyAlign: 'center',
    },
  ];

  readonly pageSize = 5;
  searchTerm = '';
  selectedCategory = 'ALL';
  selectedStockStatus = 'ALL';
  currentPage = 1;
  isLoading = true;
  errorMessage = '';
  isDeleting = false;
  deleteErrorMessage = '';
  confirmDeleteOpen = false;
  pendingDeleteProduct: Product | null = null;

  readonly stockOptions: Array<'ALL' | ProductStockStatus> = [
    'ALL',
    'IN_STOCK',
    'LOW_STOCK',
    'OUT_OF_STOCK',
  ];

  allProducts: Product[] = [];
  allCategories: Category[] = [];
  private readonly categoryNamesById: Record<string, string> = {};

  ngOnInit(): void {
    this.loadProducts();
  }

  get categoryOptions(): ProductCategoryOption[] {
    return this.getUniqueCategories()
      .map((category) => ({
        id: category._id,
        name: category.name,
      }))
      .sort((first, second) => first.name.localeCompare(second.name));
  }

  get statsCards(): ProductStatsCard[] {
    const outOfStockCount = this.allProducts.filter(
      (product) => this.getProductStockStatus(product) === 'OUT_OF_STOCK',
    ).length;
    const inventoryValue = this.allProducts.reduce(
      (total, product) => total + product.price * product.stock,
      0,
    );

    return [
      {
        iconClass: 'pi pi-chart-line text-[#2f6bff]',
        iconWrapperClass: 'bg-[#edf4ff]',
        title: 'ALL PRODUCTS',
        value: this.allProducts.length.toString(),
      },
      {
        iconClass: 'pi pi-exclamation-triangle text-[#e7a11b]',
        iconWrapperClass: 'bg-[#fff7e8]',
        title: 'OUT OF STOCK',
        value: outOfStockCount.toString(),
      },
      {
        iconClass: 'pi pi-sitemap text-[#9a4dff]',
        iconWrapperClass: 'bg-[#f7f0ff]',
        title: 'CATEGORIES',
        value: this.getUniqueCategories().length.toString(),
      },
      {
        iconClass: 'pi pi-wallet text-[#17b26a]',
        iconWrapperClass: 'bg-[#ebfbf3]',
        title: 'INVENTORY VALUE',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EGP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(inventoryValue),
      },
    ];
  }

  get filteredProducts(): Product[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    return this.allProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearchTerm ||
        product.name.toLowerCase().includes(normalizedSearchTerm) ||
        product.description.toLowerCase().includes(normalizedSearchTerm);
      const matchesCategory =
        this.selectedCategory === 'ALL' || product.category === this.selectedCategory;
      const matchesStock =
        this.selectedStockStatus === 'ALL' ||
        this.getProductStockStatus(product) === this.selectedStockStatus;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get showingFrom(): number {
    if (!this.filteredProducts.length) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredProducts.length);
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      productsResponse: this.productsService.getProducts(),
      categoriesResponse: this.categoriesService.getCategories(),
    }).subscribe({
      next: ({ productsResponse, categoriesResponse }) => {
        this.allProducts = productsResponse.data.filter((product) => product.isDeleted === false);
        this.allCategories = categoriesResponse.data;
        this.buildCategoryNamesMap();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load products right now. Please try again.';
        this.isLoading = false;
      },
    });
  }

  getCategoryClass(_category: string): string {
    return 'bg-[#eef2ff] text-[#2f6bff]';
  }

  getCategoryLabel(category: string): string {
    return this.categoryNamesById[category] ?? category;
  }

  getProductStockStatus(product: Product): ProductStockStatus {
    if (product.stock <= 0) {
      return 'OUT_OF_STOCK';
    }

    if (product.stock <= 5) {
      return 'LOW_STOCK';
    }

    return 'IN_STOCK';
  }

  getStockLabel(product: Product): string {
    switch (this.getProductStockStatus(product)) {
      case 'IN_STOCK':
        return `In Stock (${product.stock})`;
      case 'LOW_STOCK':
        return `Low Stock (${product.stock})`;
      case 'OUT_OF_STOCK':
        return 'Out of Stock (0)';
    }
  }

  getStockDotClass(status: ProductStockStatus): string {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-[#12b76a]';
      case 'LOW_STOCK':
        return 'bg-[#f79009]';
      case 'OUT_OF_STOCK':
        return 'bg-[#f04438]';
      default:
        return 'bg-slate-400';
    }
  }

  getProductTableImage(product: Product): string {
    const defaultVariation = product.variations.find((variation) => variation.isDefault);

    if (defaultVariation?.defaultImage) {
      return defaultVariation.defaultImage;
    }

    if (defaultVariation?.defaultImg) {
      return defaultVariation.defaultImg;
    }

    return product.image;
  }

  isCreateProductModalOpen = false;

  openCreateProductModal(): void {
    this.isCreateProductModalOpen = true;
  }

  closeCreateProductModal(): void {
    this.isCreateProductModalOpen = false;
  }

  requestDeleteProduct(product: Product): void {
    this.pendingDeleteProduct = product;
    this.deleteErrorMessage = '';
    this.confirmDeleteOpen = true;
  }

  closeDeleteModal(): void {
    this.confirmDeleteOpen = false;
    this.pendingDeleteProduct = null;
    this.deleteErrorMessage = '';
    this.isDeleting = false;
  }

  confirmDeleteProduct(): void {
    if (!this.pendingDeleteProduct || this.isDeleting) {
      return;
    }

    this.isDeleting = true;

    this.productsService
      .updateProductById(
        this.pendingDeleteProduct._id,
        this.buildDeleteProductFormData(this.pendingDeleteProduct),
      )
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.refreshProducts();
        },
        error: () => {
          this.isDeleting = false;
          this.deleteErrorMessage = 'Unable to delete product right now. Please try again.';
        },
      });
  }

  refreshProducts(): void {
    this.resetPagination();
    this.loadProducts();
  }

  updateSearchTerm(value: string): void {
    this.searchTerm = value;
    this.resetPagination();
  }

  updateSelectedCategory(value: string): void {
    this.selectedCategory = value;
    this.resetPagination();
  }

  updateSelectedStockStatus(value: string): void {
    this.selectedStockStatus = value;
    this.resetPagination();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  resetPagination(): void {
    this.currentPage = 1;
  }

  private buildCategoryNamesMap(): void {
    this.getUniqueCategories().forEach((category) => {
      const fallbackId = category.name.trim().toLowerCase();
      this.categoryNamesById[category._id || fallbackId] = category.name;
    });
  }

  private getUniqueCategories(): Category[] {
    const uniqueCategories = new Map<string, Category>();

    this.allCategories.forEach((category) => {
      const fallbackId = category.name.trim().toLowerCase();
      const key = category._id || fallbackId;

      if (!uniqueCategories.has(key)) {
        uniqueCategories.set(key, category);
      }
    });

    return [...uniqueCategories.values()];
  }

  private buildDeleteProductFormData(product: Product): FormData {
    const payload = new FormData();

    payload.append('name', product.name);
    payload.append('description', product.description);
    payload.append('price', product.price.toString());
    payload.append('category', product.category);
    payload.append('featured', String(product.featured));
    payload.append('visible', String(product.visible));
    payload.append('isDeleted', 'true');
    payload.append(
      'variations',
      JSON.stringify(
        this.normalizeProductVariations(product).map((variation) => ({
          colorName: variation.colorName,
          colorValue: variation.colorValue,
          defaultImage: variation.defaultImage || variation.defaultImg || product.image,
          variationImgs: variation.variationImgs ?? variation.variantImages ?? [],
          isDefault: variation.isDefault === true,
          stock: variation.stock,
        })),
      ),
    );

    return payload;
  }

  private normalizeProductVariations(product: Product): ProductVariation[] {
    if (!product.variations.length) {
      return [
        {
          colorName: 'Default',
          colorValue: '#000000',
          defaultImage: product.image,
          variationImgs: [],
          isDefault: true,
          stock: product.stock,
        },
      ];
    }

    const hasExplicitDefault = product.variations.some((variation) => variation.isDefault === true);

    return product.variations.map((variation, index) => ({
      ...variation,
      defaultImage: variation.defaultImage || variation.defaultImg || product.image,
      variationImgs: variation.variationImgs ?? variation.variantImages ?? [],
      isDefault: hasExplicitDefault ? variation.isDefault === true : index === 0,
    }));
  }

  getStockTextClass(status: ProductStockStatus): string {
    switch (status) {
      case 'IN_STOCK':
        return 'text-[#039855]';
      case 'LOW_STOCK':
        return 'text-[#f79009]';
      case 'OUT_OF_STOCK':
        return 'text-[#f04438]';
      default:
        return 'text-slate-500';
    }
  }
}
