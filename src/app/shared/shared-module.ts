import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from './components/data-table/data-table';
import { StatsCard } from './components/stats-card/stats-card';
import { TableModule } from 'primeng/table';
import { StatusBadge } from './components/status-badge/status-badge';
import { Modal } from './components/modal/modal';
@NgModule({
  declarations: [DataTable, StatsCard, StatusBadge, Modal],
  imports: [CommonModule, TableModule],
  exports: [DataTable, StatsCard, StatusBadge],
})
export class SharedModule {}
