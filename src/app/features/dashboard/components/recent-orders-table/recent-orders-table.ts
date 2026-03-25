import { Component, Input } from '@angular/core';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-recent-orders-table',
  templateUrl: './recent-orders-table.html',
  styleUrls: ['./recent-orders-table.css'],
  standalone: false,
})
export class RecentOrdersTable {
  @Input() orders: Order[] = [];

  getStatusClasses(status: Order['status']): string {
    switch (status) {
      case 'Pending':
        return 'bg-[#fff3d6] text-[#c98508]';
      case 'Confirmed':
        return 'bg-[#e7efff] text-[#3b6ef5]';
      case 'Shipped':
        return 'bg-[#dff7fb] text-[#0f9bb3]';
      case 'Delivered':
        return 'bg-[#dbf3df] text-[#2c9b49]';
      case 'Cancelled':
        return 'bg-[#fde3e1] text-[#dc4c43]';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }
}
