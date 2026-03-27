import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecentOrdersTable } from './components/recent-orders-table/recent-orders-table';
import { StatsCards } from './components/stats-cards/stats-cards';
import { DashboardOverview } from './pages/dashboard-overview/dashboard-overview';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [RecentOrdersTable, StatsCards, DashboardOverview],
  imports: [CommonModule, DashboardRoutingModule, TableModule],
})
export class DashboardModule {}
