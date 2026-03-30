import { Component } from '@angular/core';

@Component({
  selector: 'app-products-filters',
  standalone: false,
  templateUrl: './products-filters.html',
  styleUrl: './products-filters.css',
})
export class ProductsFilters {
  categories = ['All Categories'];
  stockOptions = ['In Stock'];
}
