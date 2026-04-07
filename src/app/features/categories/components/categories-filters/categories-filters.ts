import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryStatus } from '../../models/categories.model';

type CategorySortField = 'name' | 'status' | 'createdAt';

@Component({
  selector: 'app-categories-filters',
  standalone: false,
  templateUrl: './categories-filters.html',
  styleUrl: './categories-filters.css',
})
export class CategoriesFilters {
  @Input() searchTerm = '';
  @Input() selectedStatus: 'ALL' | CategoryStatus = 'ALL';
  @Input() selectedSortField: CategorySortField = 'name';
  @Input() selectedSortDirection: 'asc' | 'desc' = 'asc';
  @Input() statusOptions: Array<'ALL' | CategoryStatus> = [];
  @Input() sortFields: ReadonlyArray<{ label: string; value: CategorySortField }> = [];

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedStatusChange = new EventEmitter<'ALL' | CategoryStatus>();
  @Output() selectedSortFieldChange = new EventEmitter<CategorySortField>();
  @Output() selectedSortDirectionChange = new EventEmitter<'asc' | 'desc'>();

  onSearchTermChange(value: string): void {
    this.searchTermChange.emit(value);
  }

  onSelectedStatusChange(value: 'ALL' | CategoryStatus): void {
    this.selectedStatusChange.emit(value);
  }

  onSelectedSortFieldChange(value: CategorySortField): void {
    this.selectedSortFieldChange.emit(value);
  }

  onSelectedSortDirectionChange(value: 'asc' | 'desc'): void {
    this.selectedSortDirectionChange.emit(value);
  }
}
