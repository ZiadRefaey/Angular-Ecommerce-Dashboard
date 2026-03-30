import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing-module';
import { OrdersPage } from './pages/orders-page/orders-page';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [OrdersPage],
  imports: [CommonModule, OrdersRoutingModule, SharedModule],
})
export class OrdersModule {}
