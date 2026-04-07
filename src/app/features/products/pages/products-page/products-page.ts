import { Component } from '@angular/core';
import {
  Product,
  ProductCategory,
  ProductStockStatus,
} from '../../../models/product.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';
import { ProductStatsCard } from '../../../dashboard/models/product.model';

@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage {
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

  readonly categoryOptions: Array<'ALL' | ProductCategory> = [
    'ALL',
    'AUDIO',
    'MOBILE',
    'COMPUTING',
  ];
  readonly stockOptions: Array<'ALL' | ProductStockStatus> = [
    'ALL',
    'IN_STOCK',
    'LOW_STOCK',
    'OUT_OF_STOCK',
  ];

  allProducts: Product[] = [
    {
      id: 1,
      image: 'assets/products/headphones-1.jpg',
      name: 'Sony WH-1000XM5',
      category: 'AUDIO',
      price: 349,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (42)',
    },
    {
      id: 2,
      image: 'assets/products/phone-1.jpg',
      name: 'Samsung Galaxy S24 Ultra',
      category: 'MOBILE',
      price: 1299,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (18)',
    },
    {
      id: 3,
      image: 'assets/products/macbook-1.jpg',
      name: 'MacBook Air M3',
      category: 'COMPUTING',
      price: 1099,
      stockStatus: 'LOW_STOCK',
      stockLabel: 'Low Stock (5)',
    },
    {
      id: 4,
      image: 'assets/products/ipad-1.jpg',
      name: 'iPad Pro 11-inch',
      category: 'MOBILE',
      price: 799,
      stockStatus: 'OUT_OF_STOCK',
      stockLabel: 'Out of Stock (0)',
    },
    {
      id: 5,
      image: 'assets/products/headphones-2.jpg',
      name: 'Bose QuietComfort Ultra',
      category: 'AUDIO',
      price: 429,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (12)',
    },
    {
      id: 6,
      image: 'assets/products/phone-1.jpg',
      name: 'Google Pixel 9 Pro',
      category: 'MOBILE',
      price: 999,
      stockStatus: 'LOW_STOCK',
      stockLabel: 'Low Stock (4)',
    },
    {
      id: 7,
      image: 'assets/products/macbook-1.jpg',
      name: 'Dell XPS 14',
      category: 'COMPUTING',
      price: 1599,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (11)',
    },
    {
      id: 8,
      image: 'assets/products/headphones-2.jpg',
      name: 'JBL Live 770NC',
      category: 'AUDIO',
      price: 199,
      stockStatus: 'OUT_OF_STOCK',
      stockLabel: 'Out of Stock (0)',
    },
    {
      id: 9,
      image: 'assets/products/ipad-1.jpg',
      name: 'Lenovo Tab P12',
      category: 'MOBILE',
      price: 379,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (24)',
    },
    {
      id: 10,
      image: 'assets/products/headphones-1.jpg',
      name: 'Logitech G Pro X 2',
      category: 'AUDIO',
      price: 249,
      stockStatus: 'LOW_STOCK',
      stockLabel: 'Low Stock (3)',
    },
  ];

  get statsCards(): ProductStatsCard[] {
    const outOfStockCount = this.allProducts.filter(
      (product) => product.stockStatus === 'OUT_OF_STOCK',
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
        value: (this.categoryOptions.length - 1).toString(),
      },
      {
        iconClass: 'pi pi-wallet text-[#17b26a]',
        iconWrapperClass: 'bg-[#ebfbf3]',
        title: 'INVENTORY VALUE',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(inventoryValue),
      },
    ];
  }

  get filteredProducts(): Product[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    return this.allProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearchTerm || product.name.toLowerCase().includes(normalizedSearchTerm);
      const matchesCategory =
        this.selectedCategory === 'ALL' || product.category === this.selectedCategory;
      const matchesStock =
        this.selectedStockStatus === 'ALL' || product.stockStatus === this.selectedStockStatus;

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

  getCategoryClass(category: Product['category']): string {
    switch (category) {
      case 'AUDIO':
        return 'bg-[#eef2ff] text-[#2f6bff]';
      case 'MOBILE':
        return 'bg-[#eef2ff] text-[#2f6bff]';
      case 'COMPUTING':
        return 'bg-[#eef2f6] text-[#475467]';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }

  getStockDotClass(status: Product['stockStatus']): string {
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

  private resetPagination(): void {
    this.currentPage = 1;
  }

  getStockTextClass(status: Product['stockStatus']): string {
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
