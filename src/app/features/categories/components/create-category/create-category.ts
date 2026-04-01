import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-category',
  standalone: false,
  templateUrl: './create-category.html',
  styleUrl: './create-category.css',
})
export class CreateCategory {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  selectedFileName = '';
  categoryName = '';

  onClose(): void {
    this.closed.emit();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.selectedFileName = file ? file.name : '';
  }

  onCreateCategory(): void {
    console.log({
      categoryName: this.categoryName,
      fileName: this.selectedFileName,
    });

    this.closed.emit();
  }
}
