import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsFilters } from './components/products-filters/products-filters';
import { ProductsPage } from './pages/products-page/products-page';
import { SharedModule } from '../../shared/shared-module';
import { ProductsRoutingModule } from './products-routing-module';
import { CreateProduct } from './components/create-product/create-product';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ProductsFilters, ProductsPage, CreateProduct],
  imports: [CommonModule, SharedModule, ProductsRoutingModule, FormsModule],
})
export class ProductsModule {}
