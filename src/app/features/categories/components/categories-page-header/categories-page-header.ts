import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-categories-page-header',
  standalone: false,
  templateUrl: './categories-page-header.html',
  styleUrl: './categories-page-header.css',
})
export class CategoriesPageHeader {
  @Output() addCategory = new EventEmitter<void>();

  onAddCategory(): void {
    this.addCategory.emit();
  }
}
