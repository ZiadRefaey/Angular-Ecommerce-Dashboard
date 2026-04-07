import { Component } from '@angular/core';
import { DashboardStat } from '../../models/dashboard-stat.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.html',
  styleUrls: ['./dashboard-overview.css'],
  standalone: false,
})
export class DashboardOverview {
  stats: DashboardStat[] = [
    {
      id: 1,
      title: 'TOTAL USERS',
      value: '12,840',
      icon: 'users',
    },
    {
      id: 2,
      title: 'PRODUCTS',
      value: '4,250',
      icon: 'products',
    },
    {
      id: 3,
      title: 'CATEGORIES',
      value: '85',
      icon: 'categories',
    },
    {
      id: 4,
      title: 'TOTAL ORDERS',
      value: '45,210',
      icon: 'orders',
    },
    {
      id: 5,
      title: 'REVENUE',
      value: '$1.2M',
      icon: 'revenue',
    },
  ];

  recentOrders: Order[] = [
    {
      orderId: '#ORD-7721',
      customerName: 'Alex Johnson',
      totalPrice: 299.0,
      status: 'Pending',
      date: 'Oct 24, 2023',
    },
    {
      orderId: '#ORD-7720',
      customerName: 'Sarah Williams',
      totalPrice: 1149.5,
      status: 'Confirmed',
      date: 'Oct 24, 2023',
    },
    {
      orderId: '#ORD-7719',
      customerName: 'Michael Chen',
      totalPrice: 89.0,
      status: 'Shipped',
      date: 'Oct 23, 2023',
    },
    {
      orderId: '#ORD-7718',
      customerName: 'Emily Davis',
      totalPrice: 540.2,
      status: 'Delivered',
      date: 'Oct 23, 2023',
    },
    {
      orderId: '#ORD-7717',
      customerName: 'Robert Smith',
      totalPrice: 210.0,
      status: 'Cancelled',
      date: 'Oct 22, 2023',
    },
  ];
}
