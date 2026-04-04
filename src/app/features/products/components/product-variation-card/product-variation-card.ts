import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProductVariation } from '../../models/edit-product-model';
@Component({
  selector: 'app-product-variation-card',
  templateUrl: './product-variation-card.html',
  styleUrls: ['./product-variation-card.css'],
  standalone: false,
})
export class ProductVariationCard {
  @Input({ required: true }) variation!: IProductVariation;
  @Input() isActiveMediaTarget = false;

  @Output() editMedia = new EventEmitter<string>();
  @Output() setDefault = new EventEmitter<string>();
  @Output() deleteVariation = new EventEmitter<string>();
  @Output() variationChange = new EventEmitter<IProductVariation>();

  onSkuChange(value: string): void {
    this.variationChange.emit({ ...this.variation, sku: value });
  }

  onPriceAdjChange(value: string): void {
    this.variationChange.emit({
      ...this.variation,
      priceAdjustment: Number(value) || 0,
    });
  }

  onStockChange(value: string): void {
    this.variationChange.emit({
      ...this.variation,
      stock: Number(value) || 0,
    });
  }
}
