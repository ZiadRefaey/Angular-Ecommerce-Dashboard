import { Component } from '@angular/core';
import { Order, OrderStatsCard, OrderStatus, PaymentStatus } from '../../models/orders.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage {
  statsCards: OrderStatsCard[] = [
    {
      iconClass: 'pi pi-shopping-cart text-[#2f6bff]',
      iconWrapperClass: 'bg-[#edf4ff]',
      title: 'TOTAL ORDERS',
      value: '1,284',
    },
    {
      iconClass: 'pi pi-clock text-[#e7a11b]',
      iconWrapperClass: 'bg-[#fff7e8]',
      title: 'PENDING ORDERS',
      value: '56',
    },
    {
      iconClass: 'pi pi-check-circle text-[#17b26a]',
      iconWrapperClass: 'bg-[#ebfbf3]',
      title: 'COMPLETED ORDERS',
      value: '1,128',
    },
    {
      iconClass: 'pi pi-wallet text-[#9a4dff]',
      iconWrapperClass: 'bg-[#f7f0ff]',
      title: 'TOTAL REVENUE',
      value: '$48,250.00',
    },
  ];

  columns: DataTableColumn[] = [
    { field: 'orderId', header: 'ORDER ID', width: '14%' },
    { field: 'customer', header: 'CUSTOMER', width: '28%' },
    { field: 'total', header: 'TOTAL', width: '12%' },
    { field: 'orderStatus', header: 'ORDER STATUS', width: '16%' },
    { field: 'paymentStatus', header: 'PAYMENT STATUS', width: '16%' },
    { field: 'date', header: 'DATE', width: '10%' },
    {
      field: 'actions',
      header: 'ACTIONS',
      width: '8%',
      headerAlign: 'right',
      bodyAlign: 'right',
    },
  ];

  orders: Order[] = [
    {
      id: 1,
      orderId: '#ORD-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@example.com',
      total: 249.99,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      date: '2026-03-24',
    },
    {
      id: 2,
      orderId: '#ORD-002',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@example.com',
      total: 129.5,
      orderStatus: 'Confirmed',
      paymentStatus: 'Paid',
      date: '2026-03-24',
    },
    {
      id: 3,
      orderId: '#ORD-003',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@example.com',
      total: 89.0,
      orderStatus: 'Pending',
      paymentStatus: 'Unpaid',
      date: '2026-03-23',
    },
    {
      id: 4,
      orderId: '#ORD-004',
      customerName: 'James Wilson',
      customerEmail: 'james.wilson@example.com',
      total: 459.0,
      orderStatus: 'Shipped',
      paymentStatus: 'Paid',
      date: '2026-03-23',
    },
    {
      id: 5,
      orderId: '#ORD-005',
      customerName: 'Olivia Martinez',
      customerEmail: 'olivia.martinez@example.com',
      total: 199.99,
      orderStatus: 'Cancelled',
      paymentStatus: 'Unpaid',
      date: '2026-03-22',
    },
    {
      id: 6,
      orderId: '#ORD-006',
      customerName: 'Daniel Brown',
      customerEmail: 'daniel.brown@example.com',
      total: 320.0,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      date: '2026-03-22',
    },
  ];

  getInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  getOrderStatusVariant(
    status: OrderStatus,
  ): 'success' | 'info' | 'warning' | 'primary' | 'danger' {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Confirmed':
        return 'primary';
      case 'Pending':
        return 'warning';
      case 'Shipped':
        return 'info';
      case 'Cancelled':
        return 'danger';
    }
  }

  getPaymentStatusVariant(status: PaymentStatus): 'success' | 'danger' {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Unpaid':
        return 'danger';
    }
  }
}
