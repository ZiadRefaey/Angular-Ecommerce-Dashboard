import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProductCategoryOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-products-filters',
  standalone: false,
  templateUrl: './products-filters.html',
  styleUrl: './products-filters.css',
})
export class ProductsFilters {
  @Input() searchTerm = '';
  @Input() categoryOptions: ProductCategoryOption[] = [];
  @Input() stockOptions: string[] = [];
  @Input() selectedCategory = 'ALL';
  @Input() selectedStockStatus = 'ALL';

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedCategoryChange = new EventEmitter<string>();
  @Output() selectedStockStatusChange = new EventEmitter<string>();

  onSearchTermChange(value: string): void {
    this.searchTermChange.emit(value);
  }

  onCategoryChange(value: string): void {
    this.selectedCategoryChange.emit(value);
  }

  onStockStatusChange(value: string): void {
    this.selectedStockStatusChange.emit(value);
  }
}
