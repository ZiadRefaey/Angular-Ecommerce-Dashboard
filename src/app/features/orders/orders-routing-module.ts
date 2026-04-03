import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersPage } from './pages/orders-page/orders-page';
import { OrderDetails } from './pages/order-details/order-details';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage,
  },
  {
    path: ':id',
    component: OrderDetails,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
