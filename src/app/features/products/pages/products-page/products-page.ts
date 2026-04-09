import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';
import { ProductStatsCard } from '../../../dashboard/models/product.model';
import { Product, ProductsResponse } from '../../models/products.model';
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
      headerAlign: 'right',
      bodyAlign: 'right',
    },
  ];

  readonly pageSize = 5;
  searchTerm = '';
  selectedCategory = 'ALL';
  selectedStockStatus = 'ALL';
  currentPage = 1;
  isLoading = true;
  errorMessage = '';

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
    const inventoryValue = this.allProducts.reduce((total, product) => total + product.price, 0);

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
        this.allProducts = productsResponse.data;
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
  isCreateProductModalOpen = false;

  openCreateProductModal(): void {
    this.isCreateProductModalOpen = true;
  }

  closeCreateProductModal(): void {
    this.isCreateProductModalOpen = false;
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
