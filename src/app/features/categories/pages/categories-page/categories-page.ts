import { Component } from '@angular/core';
import { Category, CategoryStatsCard, CategoryStatus } from '../../models/categories.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage {
  statsCards: CategoryStatsCard[] = [
    {
      iconClass: 'pi pi-sitemap text-[#2f6bff]',
      iconWrapperClass: 'bg-[#edf4ff]',
      title: 'TOTAL CATEGORIES',
      value: '12',
    },
    {
      iconClass: 'pi pi-check-circle text-[#17b26a]',
      iconWrapperClass: 'bg-[#ebfbf3]',
      title: 'ACTIVE CATEGORIES',
      value: '9',
    },
    {
      iconClass: 'pi pi-clock text-[#e7a11b]',
      iconWrapperClass: 'bg-[#fff7e8]',
      title: 'DRAFT CATEGORIES',
      value: '3',
    },
    {
      iconClass: 'pi pi-box text-[#9a4dff]',
      iconWrapperClass: 'bg-[#f7f0ff]',
      title: 'TOTAL PRODUCTS',
      value: '1,284',
    },
  ];

  columns: DataTableColumn[] = [
    { field: 'name', header: 'CATEGORY NAME', width: '40%' },
    { field: 'productsCount', header: 'PRODUCTS', width: '20%' },
    { field: 'status', header: 'STATUS', width: '20%' },
    { field: 'createdAt', header: 'CREATED AT', width: '12%' },
    {
      field: 'actions',
      header: 'ACTIONS',
      width: '8%',
      headerAlign: 'right',
      bodyAlign: 'right',
    },
  ];

  categories: Category[] = [
    {
      id: 1,
      name: 'Laptops & Computers',
      productsCount: 128,
      status: 'ACTIVE',
      createdAt: '2026-03-10',
    },
    {
      id: 2,
      name: 'Smartphones',
      productsCount: 95,
      status: 'ACTIVE',
      createdAt: '2026-03-09',
    },
    {
      id: 3,
      name: 'Audio Devices',
      productsCount: 64,
      status: 'ACTIVE',
      createdAt: '2026-03-08',
    },
    {
      id: 4,
      name: 'Gaming',
      productsCount: 42,
      status: 'DRAFT',
      createdAt: '2026-03-07',
    },
    {
      id: 5,
      name: 'Accessories',
      productsCount: 76,
      status: 'ACTIVE',
      createdAt: '2026-03-06',
    },
    {
      id: 6,
      name: 'Wearables',
      productsCount: 31,
      status: 'DRAFT',
      createdAt: '2026-03-05',
    },
  ];
  isCreateCategoryModalOpen = false;

  openCreateCategoryModal(): void {
    this.isCreateCategoryModalOpen = true;
  }

  closeCreateCategoryModal(): void {
    this.isCreateCategoryModalOpen = false;
  }
  getStatusVariant(status: CategoryStatus): 'success' | 'warning' {
    return status === 'ACTIVE' ? 'success' : 'warning';
  }
}
