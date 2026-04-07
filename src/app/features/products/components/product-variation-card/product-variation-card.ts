import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProductVariation } from '../../models/edit-product-model';
import { PRODUCT_COLORS } from '../../../../core/Constants/PRODUCT_COLORS';

type ProductColor = (typeof PRODUCT_COLORS)[number];
type SelectableProductColor = ProductColor & { disabled: boolean };
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
  @Input() colorOptions: readonly ProductColor[] = PRODUCT_COLORS;

  @Output() editMedia = new EventEmitter<string>();
  @Output() setDefault = new EventEmitter<string>();
  @Output() deleteVariation = new EventEmitter<string>();
  @Output() variationChange = new EventEmitter<IProductVariation>();

  get selectableColorOptions(): SelectableProductColor[] {
    return this.colorOptions.map((color) => ({
      ...color,
      disabled: this.isColorDisabled(color.name),
    }));
  }

  onStockChange(value: string): void {
    this.variationChange.emit({
      ...this.variation,
      stock: Number(value) || 0,
    });
  }

  onColorChange(value: string | null): void {
    const selectedColor = this.colorOptions.find((color) => color.name === value);

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

  isColorDisabled(colorName: string): boolean {
    return this.unavailableColorNames.includes(colorName);
  }

  getColorByName(colorName: string): ProductColor | undefined {
    return this.colorOptions.find((color) => color.name === colorName);
  }
}
