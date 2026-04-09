import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from './components/data-table/data-table';
import { StatsCard } from './components/stats-card/stats-card';
import { TableModule } from 'primeng/table';
import { StatusBadge } from './components/status-badge/status-badge';
import { Modal } from './components/modal/modal';
import { Button } from './components/button/button';
import { CategoryDatePipe } from './pipes/category-date.pipe';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [DataTable, StatsCard, StatusBadge, Modal, Button, CategoryDatePipe, LoadingSpinner],
  imports: [CommonModule, TableModule, ProgressSpinnerModule],
  exports: [DataTable, StatsCard, StatusBadge, Modal, Button, CategoryDatePipe, LoadingSpinner],
})
export class SharedModule {}
