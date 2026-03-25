import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { TableModule } from 'primeng/table';

import { SideBar } from './shared/components/side-bar/side-bar';
import { Layout } from './shared/components/layout/layout';
import { Header } from './shared/components/layout/header/header';
import { StatsCards } from './features/dashboard/components/stats-cards/stats-cards';
import { RecentOrdersTable } from './features/dashboard/components/recent-orders-table/recent-orders-table';
import { DashboardOverview } from './features/dashboard/pages/dashboard-overview/dashboard-overview';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [App, SideBar, Layout, Header, StatsCards, RecentOrdersTable, DashboardOverview],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, TableModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
  bootstrap: [App],
})
export class AppModule {}
