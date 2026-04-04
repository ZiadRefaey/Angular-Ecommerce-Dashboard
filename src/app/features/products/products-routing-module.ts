import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPage } from './pages/products-page/products-page';
import { EditProductPage } from './pages/edit-product-page/edit-product-page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
  },
  {
    path: ':id',
    component: EditProductPage,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
