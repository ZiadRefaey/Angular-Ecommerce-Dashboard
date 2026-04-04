import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProductVariation } from '../../models/edit-product-model';

@Component({
  selector: 'app-product-variations',
  templateUrl: './product-variations.html',
  styleUrls: ['./product-variations.css'],
  standalone: false,
})
export class ProductVariations {
  @Input() variations: IProductVariation[] = [];
  @Input() activeVariationId = '';

  @Output() variationMediaEdit = new EventEmitter<string>();
  @Output() variationDefault = new EventEmitter<string>();
  @Output() variationDelete = new EventEmitter<string>();
  @Output() variationUpdate = new EventEmitter<IProductVariation>();
  @Output() addVariation = new EventEmitter<void>();

  onVariationChange(updated: IProductVariation): void {
    this.variationUpdate.emit(updated);
  }
}
