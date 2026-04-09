import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProductVariation } from '../../models/edit-product-model';

export interface ProductMediaReplaceEvent {
  imageId: string;
  event: Event;
}

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
  @Output() replaceMedia = new EventEmitter<ProductMediaReplaceEvent>();

  get canDeleteMedia(): boolean {
    return (this.variation?.media.length ?? 0) > 1;
  }

  onFileInput(event: Event): void {
    this.uploadMedia.emit(event);
  }

  onReplaceInput(imageId: string, event: Event): void {
    this.replaceMedia.emit({ imageId, event });
  }
}
