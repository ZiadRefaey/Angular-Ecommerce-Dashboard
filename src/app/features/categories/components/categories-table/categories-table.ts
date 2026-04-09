import { Component, Input } from '@angular/core';
import { CategoryListItem } from '../../models/categories.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';

@Component({
  selector: 'app-categories-table',
  standalone: false,
  templateUrl: './categories-table.html',
  styleUrl: './categories-table.css',
})
export class CategoriesTable {
  @Input() categories: CategoryListItem[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() showingFrom = 0;
  @Input() showingTo = 0;
  @Input() totalItems = 0;
}
