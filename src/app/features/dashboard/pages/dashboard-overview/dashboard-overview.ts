import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DashboardStat } from '../../models/dashboard-stat.model';
import { Order } from '../../models/order.model';
import { AuthService } from '../../../../core/services/auth.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { OrderResponseItem } from '../../../orders/models/orders.model';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.html',
  styleUrls: ['./dashboard-overview.css'],
  standalone: false,
})
export class DashboardOverview implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly ordersService = inject(OrdersService);
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

  stats: DashboardStat[] = [];
  recentOrders: Order[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      usersResponse: this.authService.getAllUsers(),
      ordersResponse: this.ordersService.getAllOrders(),
      productsResponse: this.productsService.getProducts(),
      categoriesResponse: this.categoriesService.getCategories(),
    }).subscribe({
      next: ({ usersResponse, ordersResponse, productsResponse, categoriesResponse }) => {
        const activeProducts = productsResponse.data.filter((product) => product.isDeleted === false);
        const uniqueCategoriesCount = this.getUniqueCategoriesCount(categoriesResponse.data);
        const totalRevenue = ordersResponse.data.reduce((sum, order) => sum + order.totalPrice, 0);

        this.stats = [
          {
            id: 1,
            title: 'TOTAL USERS',
            value: usersResponse.data.length.toLocaleString('en-US'),
            icon: 'users',
          },
          {
            id: 2,
            title: 'PRODUCTS',
            value: activeProducts.length.toLocaleString('en-US'),
            icon: 'products',
          },
          {
            id: 3,
            title: 'CATEGORIES',
            value: uniqueCategoriesCount.toLocaleString('en-US'),
            icon: 'categories',
          },
          {
            id: 4,
            title: 'TOTAL ORDERS',
            value: ordersResponse.data.length.toLocaleString('en-US'),
            icon: 'orders',
          },
          {
            id: 5,
            title: 'REVENUE',
            value: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EGP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(totalRevenue),
            icon: 'revenue',
          },
        ];

        this.recentOrders = [...ordersResponse.data]
          .sort(
            (firstOrder, secondOrder) =>
              new Date(secondOrder.createdAt).getTime() - new Date(firstOrder.createdAt).getTime(),
          )
          .slice(0, 5)
          .map((order) => this.mapRecentOrder(order));

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load dashboard data right now.';
        this.isLoading = false;
      },
    });
  }

  private mapRecentOrder(order: OrderResponseItem): Order {
    const customerName = typeof order.user === 'string' ? 'Unknown User' : order.user.name;

    return {
      id: order._id,
      orderId: order._id.slice(0, 5),
      fullOrderId: order._id,
      customerName,
      totalPrice: order.totalPrice,
      status: this.mapOrderStatus(order.status),
      date: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(order.createdAt)),
    };
  }

  private mapOrderStatus(status: string): Order['status'] {
    switch (status.trim().toLowerCase()) {
      case 'delivered':
        return 'Delivered';
      case 'confirmed':
        return 'Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
  }

  private getUniqueCategoriesCount(categories: Array<{ _id: string; name: string }>): number {
    const uniqueCategories = new Map<string, string>();

    categories.forEach((category) => {
      const fallbackId = category.name.trim().toLowerCase();
      const key = category._id || fallbackId;

      if (!uniqueCategories.has(key)) {
        uniqueCategories.set(key, category.name);
      }
    });

    return uniqueCategories.size;
  }
}
