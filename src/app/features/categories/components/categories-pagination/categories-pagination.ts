import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-categories-pagination',
  standalone: false,
  templateUrl: './categories-pagination.html',
  styleUrl: './categories-pagination.css',
})
export class CategoriesPagination {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageNumbers: number[] = [];

  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  onPreviousPage(): void {
    this.previousPage.emit();
  }

  onNextPage(): void {
    this.nextPage.emit();
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
