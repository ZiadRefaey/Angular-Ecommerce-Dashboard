import { Component, EventEmitter, Input, Output } from '@angular/core';

type CategorySortField = 'name' | 'productsCount';

@Component({
  selector: 'app-categories-filters',
  standalone: false,
  templateUrl: './categories-filters.html',
  styleUrl: './categories-filters.css',
})
export class CategoriesFilters {
  @Input() searchTerm = '';
  @Input() selectedSortField: CategorySortField = 'name';
  @Input() selectedSortDirection: 'asc' | 'desc' = 'asc';
  @Input() sortFields: ReadonlyArray<{ label: string; value: CategorySortField }> = [];

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedSortFieldChange = new EventEmitter<CategorySortField>();
  @Output() selectedSortDirectionChange = new EventEmitter<'asc' | 'desc'>();

  onSearchTermChange(value: string): void {
    this.searchTermChange.emit(value);
  }

  onSelectedSortFieldChange(value: CategorySortField): void {
    this.selectedSortFieldChange.emit(value);
  }

  onSelectedSortDirectionChange(value: 'asc' | 'desc'): void {
    this.selectedSortDirectionChange.emit(value);
  }
}
