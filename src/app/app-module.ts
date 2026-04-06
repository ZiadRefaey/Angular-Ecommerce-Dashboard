import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { TableModule } from 'primeng/table';
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { Layout } from './core/layout/layout';
import { SideBar } from './core/layout/side-bar/side-bar';
import { Header } from './core/layout/header/header';
import { CoreModule } from './core/core-module';
@NgModule({
  declarations: [App, Layout, SideBar, Header],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    TableModule,
  ],
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
