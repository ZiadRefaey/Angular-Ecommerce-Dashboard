import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsFilters } from './components/products-filters/products-filters';
import { ProductsPage } from './pages/products-page/products-page';
import { SharedModule } from '../../shared/shared-module';
import { ProductsRoutingModule } from './products-routing-module';
import { CreateProduct } from './components/create-product/create-product';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductBasicInfo } from './components/product-basic-info/product-basic-info';
import { ProductVariations } from './components/product-variations/product-variations';
import { ProductVariationCard } from './components/product-variation-card/product-variation-card';
import { ProductMedia } from './components/product-media/product-media';
import { ProductPublishing } from './components/product-publishing/product-publishing';
import { EditProductPage } from './pages/edit-product-page/edit-product-page';
import { SelectModule } from 'primeng/select';
@NgModule({
  declarations: [
    ProductsFilters,
    ProductsPage,
    CreateProduct,
    ProductBasicInfo,
    ProductVariations,
    ProductVariationCard,
    ProductMedia,
    ProductPublishing,
    EditProductPage,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
  ],
})
export class ProductsModule {}
