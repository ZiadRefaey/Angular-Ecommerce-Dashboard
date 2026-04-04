import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-publishing',
  templateUrl: './product-publishing.html',
  styleUrls: ['./product-publishing.css'],
  standalone: false,
})
export class ProductPublishing {
  @Input({ required: true }) form!: FormGroup;
}
