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

import { SideBar } from './shared/components/side-bar/side-bar';
import { Layout } from './shared/components/layout/layout';
import { Header } from './shared/components/layout/header/header';

@NgModule({
  declarations: [App, SideBar, Layout, Header],
  imports: [BrowserModule, AppRoutingModule],
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
