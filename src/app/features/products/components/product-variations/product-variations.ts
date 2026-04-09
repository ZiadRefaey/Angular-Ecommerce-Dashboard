import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IProductVariation } from '../../models/edit-product-model';

@Component({
  selector: 'app-product-variations',
  templateUrl: './product-variations.html',
  styleUrls: ['./product-variations.css'],
  standalone: false,
})
export class ProductVariations {
  @Input() variations: IProductVariation[] = [];
  @Input() variationForms: FormGroup[] = [];
  @Input() activeVariationId = '';
  @Input() showValidation = false;

  @Output() variationMediaEdit = new EventEmitter<string>();
  @Output() variationDefault = new EventEmitter<string>();
  @Output() variationDelete = new EventEmitter<string>();
  @Output() addVariation = new EventEmitter<void>();

  get canDeleteVariation(): boolean {
    return this.variations.length > 1;
  }

  getUnavailableColorNames(currentVariationId: string): string[] {
    return this.variations
      .filter((variation) => variation.id !== currentVariationId)
      .map((variation) => variation.colorName);
  }
}
