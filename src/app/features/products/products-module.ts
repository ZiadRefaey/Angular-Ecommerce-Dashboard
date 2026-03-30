import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsFilters } from './components/products-filters/products-filters';
import { ProductsPage } from './pages/products-page/products-page';
import { SharedModule } from '../../shared/shared-module';
import { ProductsRoutingModule } from './products-routing-module';
@NgModule({
  declarations: [ProductsFilters, ProductsPage],
  imports: [CommonModule, SharedModule, ProductsRoutingModule],
})
export class ProductsModule {}
