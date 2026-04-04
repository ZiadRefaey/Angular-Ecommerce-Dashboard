import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProductVariation } from '../../models/edit-product-model';
@Component({
  selector: 'app-product-media',
  templateUrl: './product-media.html',
  styleUrls: ['./product-media.css'],
  standalone: false,
})
export class ProductMedia {
  @Input() variation?: IProductVariation;

  @Output() uploadMedia = new EventEmitter<Event>();
  @Output() selectMedia = new EventEmitter<string>();
  @Output() deleteMedia = new EventEmitter<string>();

  onFileInput(event: Event): void {
    this.uploadMedia.emit(event);
  }
}
