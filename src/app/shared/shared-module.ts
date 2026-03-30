import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from './components/data-table/data-table';
import { StatsCard } from './components/stats-card/stats-card';
import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [DataTable, StatsCard],
  imports: [CommonModule, TableModule],
  exports: [DataTable, StatsCard],
})
export class SharedModule {}
