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

  readonly pageSize = 4;
  readonly statusOptions: Array<'ALL' | CategoryStatus> = ['ALL', 'ACTIVE', 'DRAFT'];
  readonly sortFields = [
    { label: 'Name', value: 'name' },
    { label: 'Status', value: 'status' },
    { label: 'Date Added', value: 'createdAt' },
  ] as const;

  searchTerm = '';
  selectedStatus: 'ALL' | CategoryStatus = 'ALL';
  selectedSortField: (typeof this.sortFields)[number]['value'] = 'name';
  selectedSortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;

  allCategories: Category[] = [
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
    {
      id: 7,
      name: 'Smart Home',
      productsCount: 54,
      status: 'ACTIVE',
      createdAt: '2026-03-04',
    },
    {
      id: 8,
      name: 'Cameras',
      productsCount: 27,
      status: 'ACTIVE',
      createdAt: '2026-03-03',
    },
    {
      id: 9,
      name: 'Office Setup',
      productsCount: 33,
      status: 'DRAFT',
      createdAt: '2026-03-02',
    },
    {
      id: 10,
      name: 'Networking',
      productsCount: 18,
      status: 'ACTIVE',
      createdAt: '2026-03-01',
    },
  ];

  get statsCards(): CategoryStatsCard[] {
    const activeCount = this.allCategories.filter((category) => category.status === 'ACTIVE').length;
    const draftCount = this.allCategories.filter((category) => category.status === 'DRAFT').length;
    const totalProducts = this.allCategories.reduce(
      (total, category) => total + category.productsCount,
      0,
    );

    return [
      {
        iconClass: 'pi pi-sitemap text-[#2f6bff]',
        iconWrapperClass: 'bg-[#edf4ff]',
        title: 'TOTAL CATEGORIES',
        value: this.allCategories.length.toString(),
      },
      {
        iconClass: 'pi pi-check-circle text-[#17b26a]',
        iconWrapperClass: 'bg-[#ebfbf3]',
        title: 'ACTIVE CATEGORIES',
        value: activeCount.toString(),
      },
      {
        iconClass: 'pi pi-clock text-[#e7a11b]',
        iconWrapperClass: 'bg-[#fff7e8]',
        title: 'DRAFT CATEGORIES',
        value: draftCount.toString(),
      },
      {
        iconClass: 'pi pi-box text-[#9a4dff]',
        iconWrapperClass: 'bg-[#f7f0ff]',
        title: 'TOTAL PRODUCTS',
        value: totalProducts.toLocaleString('en-US'),
      },
    ];
  }

  get filteredAndSortedCategories(): Category[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    const filteredCategories = this.allCategories.filter((category) => {
      const matchesSearch = !normalizedSearch || category.name.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        this.selectedStatus === 'ALL' || category.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    return [...filteredCategories].sort((first, second) => {
      let comparison = 0;

      switch (this.selectedSortField) {
        case 'status':
          comparison = first.status.localeCompare(second.status);
          break;
        case 'createdAt':
          comparison =
            new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();
          break;
        case 'name':
        default:
          comparison = first.name.localeCompare(second.name);
          break;
      }

      return this.selectedSortDirection === 'asc' ? comparison : comparison * -1;
    });
  }

  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAndSortedCategories.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredAndSortedCategories.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get showingFrom(): number {
    if (!this.filteredAndSortedCategories.length) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredAndSortedCategories.length);
  }

  isCreateCategoryModalOpen = false;

  openCreateCategoryModal(): void {
    this.isCreateCategoryModalOpen = true;
  }

  closeCreateCategoryModal(): void {
    this.isCreateCategoryModalOpen = false;
  }

  updateSearchTerm(value: string): void {
    this.searchTerm = value;
    this.resetPagination();
  }

  updateSelectedStatus(value: 'ALL' | CategoryStatus): void {
    this.selectedStatus = value;
    this.resetPagination();
  }

  updateSelectedSortField(value: (typeof this.sortFields)[number]['value']): void {
    this.selectedSortField = value;
    this.resetPagination();
  }

  updateSelectedSortDirection(value: 'asc' | 'desc'): void {
    this.selectedSortDirection = value;
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

  getStatusVariant(status: CategoryStatus): 'success' | 'warning' {
    return status === 'ACTIVE' ? 'success' : 'warning';
  }
}
