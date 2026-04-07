import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing-module';
import { CategoriesPage } from './pages/categories-page/categories-page';
import { SharedModule } from '../../shared/shared-module';
import { CreateCategory } from './components/create-category/create-category';
import { FormsModule } from '@angular/forms';
import { CategoriesFilters } from './components/categories-filters/categories-filters';
import { CategoriesPagination } from './components/categories-pagination/categories-pagination';
import { CategoriesPageHeader } from './components/categories-page-header/categories-page-header';
import { CategoriesStatsCardsSection } from './components/categories-stats-cards-section/categories-stats-cards-section';
import { CategoriesTable } from './components/categories-table/categories-table';

@NgModule({
  declarations: [
    CategoriesPage,
    CreateCategory,
    CategoriesPageHeader,
    CategoriesStatsCardsSection,
    CategoriesFilters,
    CategoriesTable,
    CategoriesPagination,
  ],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule, FormsModule],
})
export class CategoriesModule {}
