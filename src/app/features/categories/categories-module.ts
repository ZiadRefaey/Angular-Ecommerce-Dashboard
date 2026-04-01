import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing-module';
import { CategoriesPage } from './pages/categories-page/categories-page';
import { SharedModule } from '../../shared/shared-module';
import { CreateCategory } from './components/create-category/create-category';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CategoriesPage, CreateCategory],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule, FormsModule],
})
export class CategoriesModule {}
