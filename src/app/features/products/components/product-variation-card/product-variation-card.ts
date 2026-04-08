import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProductVariation } from '../../models/edit-product-model';
import { ProductColorOption } from '../../../../core/Constants/PRODUCT_COLORS';
@Component({
  selector: 'app-product-variation-card',
  templateUrl: './product-variation-card.html',
  styleUrls: ['./product-variation-card.css'],
  standalone: false,
})
export class ProductVariationCard {
  @Input({ required: true }) variation!: IProductVariation;
  @Input() isActiveMediaTarget = false;
  @Input() unavailableColorNames: string[] = [];

  @Output() editMedia = new EventEmitter<string>();
  @Output() setDefault = new EventEmitter<string>();
  @Output() deleteVariation = new EventEmitter<string>();
  @Output() variationChange = new EventEmitter<IProductVariation>();

  onStockChange(value: string): void {
    this.variationChange.emit({
      ...this.variation,
      stock: Number(value) || 0,
    });
  }

  onColorChange(selectedColor: ProductColorOption | null): void {
    if (!selectedColor) {
      return;
    }

    this.variationChange.emit({
      ...this.variation,
      name: selectedColor.name,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
    });
  }
}
