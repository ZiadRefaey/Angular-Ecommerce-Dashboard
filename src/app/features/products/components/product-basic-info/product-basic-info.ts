import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IProductCategoryOption } from '../../models/edit-product-model';

@Component({
  selector: 'app-product-basic-info',
  templateUrl: './product-basic-info.html',
  styleUrls: ['./product-basic-info.css'],
  standalone: false,
})
export class ProductBasicInfo {
  @Input({ required: true }) form!: FormGroup;
  @Input() categories: IProductCategoryOption[] = [];
}
