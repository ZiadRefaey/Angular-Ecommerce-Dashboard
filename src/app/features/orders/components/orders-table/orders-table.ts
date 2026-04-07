import { Component, Input } from '@angular/core';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';
import { Order, OrderStatus, PaymentStatus } from '../../models/orders.model';

@Component({
  selector: 'app-orders-table',
  standalone: false,
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
  @Input() orders: Order[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() showingFrom = 0;
  @Input() showingTo = 0;
  @Input() totalItems = 0;

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
