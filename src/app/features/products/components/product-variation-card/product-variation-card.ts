import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  @Input({ required: true }) variationForm!: FormGroup;
  @Input() isActiveMediaTarget = false;
  @Input() unavailableColorNames: string[] = [];
  @Input() canDelete = true;
  @Input() showValidation = false;

  @Output() editMedia = new EventEmitter<string>();
  @Output() setDefault = new EventEmitter<string>();
  @Output() deleteVariation = new EventEmitter<string>();

  get isColorInvalid(): boolean {
    return this.showValidation && !!this.colorNameControl?.invalid;
  }

  get isStockInvalid(): boolean {
    return this.showValidation && !!this.stockInputControl?.invalid;
  }

  get stockErrorMessage(): string {
    if (this.stockInputControl?.hasError('required')) {
      return 'Stock is required.';
    }

    return 'Stock must be a number greater than 0 and cannot start with 0.';
  }

  private get colorNameControl(): FormControl<string> | null {
    return this.variationForm.get('colorName') as FormControl<string> | null;
  }

  private get colorHexControl(): FormControl<string> | null {
    return this.variationForm.get('colorHex') as FormControl<string> | null;
  }

  private get nameControl(): FormControl<string> | null {
    return this.variationForm.get('name') as FormControl<string> | null;
  }

  private get stockControl(): FormControl<number> | null {
    return this.variationForm.get('stock') as FormControl<number> | null;
  }

  private get stockInputControl(): FormControl<string> | null {
    return this.variationForm.get('stockInput') as FormControl<string> | null;
  }

  onStockChange(value: string): void {
    const trimmedValue = value.trim();
    const parsedStock = Number(trimmedValue);

    this.stockInputControl?.setValue(value);
    this.stockControl?.setValue(
      Number.isNaN(parsedStock) || !this.isValidStock(trimmedValue) ? Number.NaN : parsedStock,
    );
    this.stockInputControl?.markAsDirty();
  }

  onColorChange(selectedColor: ProductColorOption | null): void {
    if (!selectedColor) {
      return;
    }

    this.nameControl?.setValue(selectedColor.name);
    this.colorNameControl?.setValue(selectedColor.name);
    this.colorHexControl?.setValue(selectedColor.hex);
    this.colorNameControl?.markAsDirty();
  }

  private isValidStock(value: string): boolean {
    return /^[1-9]\d*(\.\d+)?$/.test(value);
  }
}


