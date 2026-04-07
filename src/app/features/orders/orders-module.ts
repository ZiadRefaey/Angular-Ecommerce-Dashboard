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
import { FormsModule } from '@angular/forms';
import { OrdersPageHeader } from './components/orders-page-header/orders-page-header';
import { OrderStatsCards } from './components/order-stats-cards/order-stats-cards';
import { OrdersTableFilters } from './components/orders-table-filters/orders-table-filters';
import { OrdersTable } from './components/orders-table/orders-table';
import { OrdersPagination } from './components/orders-pagination/orders-pagination';

@NgModule({
  declarations: [
    OrdersPage,
    OrdersPageHeader,
    OrderStatsCards,
    OrdersTableFilters,
    OrdersTable,
    OrdersPagination,
    OrderDetails,
    OrderDetailsCustomerCard,
    OrderDetailsShippingCard,
    OrderDetailsSummaryCard,
    OrderDetailsNotes,
    OrderDetailsWorkflow,
    OrderItems,
  ],
  imports: [CommonModule, OrdersRoutingModule, SharedModule, FormsModule],
})
export class OrdersModule {}
