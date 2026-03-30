import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from './components/data-table/data-table';
import { StatsCard } from './components/stats-card/stats-card';
import { TableModule } from 'primeng/table';
import { StatusBadge } from './components/status-badge/status-badge';
@NgModule({
  declarations: [DataTable, StatsCard, StatusBadge],
  imports: [CommonModule, TableModule],
  exports: [DataTable, StatsCard],
})
export class SharedModule {}
