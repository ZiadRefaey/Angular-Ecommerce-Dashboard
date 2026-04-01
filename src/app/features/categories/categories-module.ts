import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing-module';
import { CategoriesPage } from './pages/categories-page/categories-page';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [CategoriesPage],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule],
})
export class CategoriesModule {}
