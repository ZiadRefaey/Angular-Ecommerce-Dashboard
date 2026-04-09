import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CategoryListItem, CategoryStatsCard } from '../../models/categories.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ProductsService } from '../../../../core/services/products.service';
import { buildCategoryListItems } from '../../helpers/categories.mapper';

type CategorySortField = 'name' | 'productsCount';
type CategorySortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-categories-page',
  standalone: false,
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);

  columns: DataTableColumn[] = [
    { field: 'name', header: 'CATEGORY NAME', width: '46%' },
    { field: 'productsCount', header: 'PRODUCTS', width: '18%' },
    { field: 'createdAt', header: 'CREATED AT', width: '20%' },
    {
      field: 'actions',
      header: 'ACTIONS',
      width: '16%',
      headerAlign: 'center',
      bodyAlign: 'center',
    },
  ];

  readonly pageSize = 4;
  readonly sortFields: ReadonlyArray<{ label: string; value: CategorySortField }> = [
    { label: 'Name', value: 'name' },
    { label: 'Products', value: 'productsCount' },
  ];

  searchTerm = '';
  selectedSortField: CategorySortField = 'name';
  selectedSortDirection: CategorySortDirection = 'asc';
  currentPage = 1;
  isLoading = true;
  errorMessage = '';

  allCategories: CategoryListItem[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  get statsCards(): CategoryStatsCard[] {
    const totalProducts = this.filteredAndSortedCategories.reduce(
      (total, category) => total + category.productsCount,
      0,
    );
    const categoriesWithProducts = this.filteredAndSortedCategories.filter(
      (category) => category.productsCount > 0,
    ).length;
    const emptyCategories = this.filteredAndSortedCategories.filter(
      (category) => category.productsCount === 0,
    ).length;

    return [
      {
        iconClass: 'pi pi-sitemap text-[#2f6bff]',
        iconWrapperClass: 'bg-[#edf4ff]',
        title: 'TOTAL CATEGORIES',
        value: this.filteredAndSortedCategories.length.toString(),
      },
      {
        iconClass: 'pi pi-check-circle text-[#17b26a]',
        iconWrapperClass: 'bg-[#ebfbf3]',
        title: 'WITH PRODUCTS',
        value: categoriesWithProducts.toString(),
      },
      {
        iconClass: 'pi pi-inbox text-[#e7a11b]',
        iconWrapperClass: 'bg-[#fff7e8]',
        title: 'EMPTY CATEGORIES',
        value: emptyCategories.toString(),
      },
      {
        iconClass: 'pi pi-box text-[#9a4dff]',
        iconWrapperClass: 'bg-[#f7f0ff]',
        title: 'TOTAL PRODUCTS',
        value: totalProducts.toLocaleString('en-US'),
      },
    ];
  }

  get filteredAndSortedCategories(): CategoryListItem[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    const filteredCategories = this.allCategories.filter((category) => {
      return !normalizedSearch || category.name.toLowerCase().includes(normalizedSearch);
    });

    return [...filteredCategories].sort((first, second) => {
      let comparison = 0;

      switch (this.selectedSortField) {
        case 'productsCount':
          comparison = first.productsCount - second.productsCount;
          break;
        case 'name':
        default:
          comparison = first.name.localeCompare(second.name);
          break;
      }

      return this.selectedSortDirection === 'asc' ? comparison : comparison * -1;
    });
  }

  get paginatedCategories(): CategoryListItem[] {
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

  updateSelectedSortField(value: CategorySortField): void {
    this.selectedSortField = value;
    this.resetPagination();
  }

  updateSelectedSortDirection(value: CategorySortDirection): void {
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

  private loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      categoriesResponse: this.categoriesService.getCategories(),
      productsResponse: this.productsService.getProducts(),
    }).subscribe({
      next: ({ categoriesResponse, productsResponse }) => {
        this.allCategories = buildCategoryListItems(
          categoriesResponse.data,
          productsResponse.data,
        );
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load categories right now. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
