import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard-module').then((m) => m.DashboardModule),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products-module').then((m) => m.ProductsModule),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders-module').then((m) => m.OrdersModule),
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./features/categories/categories-module').then((m) => m.CategoriesModule),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
