import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-product',
  standalone: false,
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  productName = '';
  category = '';
  unitPrice = '';
  stockUnits = '';
  selectedFileName = '';

  onClose(): void {
    this.closed.emit();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFileName = file ? file.name : '';
  }

  onCreateProduct(): void {
    console.log({
      productName: this.productName,
      category: this.category,
      unitPrice: this.unitPrice,
      stockUnits: this.stockUnits,
      selectedFileName: this.selectedFileName,
    });

    this.closed.emit();
  }
}
