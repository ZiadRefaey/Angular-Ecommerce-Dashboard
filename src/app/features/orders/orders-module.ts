import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing-module';
import { OrdersPage } from './pages/orders-page/orders-page';
import { SharedModule } from '../../shared/shared-module';
import { OrderDetails } from './pages/order-details/order-details';
import { OrderDetailsCustomerCard } from './components/order-details-customer-card/order-details-customer-card';
import { OrderDetailsShippingCard } from './components/order-details-shipping-card/order-details-shipping-card';
import { OrderDetailsSummaryCard } from './components/order-details-summary-card/order-details-summary-card';
import { OrderDetailsNotes } from './components/order-details-notes/order-details-notes';
import { OrderDetailsWorkflow } from './components/order-details-workflow/order-details-workflow';
import { OrderItems } from './components/order-items/order-items';

@NgModule({
  declarations: [
    OrdersPage,
    OrderDetails,
    OrderDetailsCustomerCard,
    OrderDetailsShippingCard,
    OrderDetailsSummaryCard,
    OrderDetailsNotes,
    OrderDetailsWorkflow,
    OrderItems,
  ],
  imports: [CommonModule, OrdersRoutingModule, SharedModule],
})
export class OrdersModule {}
