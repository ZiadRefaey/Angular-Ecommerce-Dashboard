import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  PRODUCT_COLORS,
  ProductColorOption,
} from '../../../../core/Constants/PRODUCT_COLORS';

type SelectableProductColor = ProductColorOption & { disabled: boolean };

@Component({
  selector: 'app-product-color-select',
  templateUrl: './product-color-select.html',
  styleUrls: ['./product-color-select.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductColorSelect),
      multi: true,
    },
  ],
})
export class ProductColorSelect implements ControlValueAccessor {
  @Input() unavailableColorNames: string[] = [];
  @Input() placeholder = 'Choose a color';
  @Input() invalid = false;
  @Output() colorSelected = new EventEmitter<ProductColorOption | null>();

  readonly colorOptions = PRODUCT_COLORS;

  isDisabled = false;
  value: string | null = null;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  get selectableColorOptions(): SelectableProductColor[] {
    return this.colorOptions.map((color) => ({
      ...color,
      disabled: color.name !== this.value && this.unavailableColorNames.includes(color.name),
    }));
  }

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: string | null): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.colorSelected.emit(this.colorOptions.find((color) => color.name === value) ?? null);
  }
}
