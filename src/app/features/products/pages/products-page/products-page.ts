import { Component } from '@angular/core';
import { Product } from '../../../models/product.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';
import { ProductStatsCard } from '../../../dashboard/models/product.model';

@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage {
  statsCards: ProductStatsCard[] = [
    {
      iconClass: 'pi pi-chart-line text-[#2f6bff]',
      iconWrapperClass: 'bg-[#edf4ff]',
      title: 'ALL PRODUCTS',
      value: '124',
    },
    {
      iconClass: 'pi pi-exclamation-triangle text-[#e7a11b]',
      iconWrapperClass: 'bg-[#fff7e8]',
      title: 'OUT OF STOCK',
      value: '8Products',
    },
    {
      iconClass: 'pi pi-sitemap text-[#9a4dff]',
      iconWrapperClass: 'bg-[#f7f0ff]',
      title: 'CATEGORIES',
      value: '3Categories',
    },
    {
      iconClass: 'pi pi-wallet text-[#17b26a]',
      iconWrapperClass: 'bg-[#ebfbf3]',
      title: 'INVENTORY VALUE',
      value: '$245,850.00',
    },
  ];

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

  products: Product[] = [
    {
      id: 1,
      image: 'assets/products/headphones-1.jpg',
      name: 'Sony WH-1000XM5',
      sku: 'SNY-HDP-005',
      category: 'AUDIO',
      price: 349,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (42)',
    },
    {
      id: 2,
      image: 'assets/products/phone-1.jpg',
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SMG-S24-U',
      category: 'MOBILE',
      price: 1299,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (18)',
    },
    {
      id: 3,
      image: 'assets/products/macbook-1.jpg',
      name: 'MacBook Air M3',
      sku: 'APL-MBA-M3',
      category: 'COMPUTING',
      price: 1099,
      stockStatus: 'LOW_STOCK',
      stockLabel: 'Low Stock (5)',
    },
    {
      id: 4,
      image: 'assets/products/ipad-1.jpg',
      name: 'iPad Pro 11-inch',
      sku: 'APL-IPP-11',
      category: 'MOBILE',
      price: 799,
      stockStatus: 'OUT_OF_STOCK',
      stockLabel: 'Out of Stock (0)',
    },
    {
      id: 5,
      image: 'assets/products/headphones-2.jpg',
      name: 'Bose QuietComfort Ultra',
      sku: 'BSE-QC-ULT',
      category: 'AUDIO',
      price: 429,
      stockStatus: 'IN_STOCK',
      stockLabel: 'In Stock (12)',
    },
  ];

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
