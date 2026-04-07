import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderStatus, PaymentStatus } from '../../models/orders.model';

type OrderSortField = 'total' | 'date' | 'orderId' | 'customerName';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-orders-table-filters',
  standalone: false,
  templateUrl: './orders-table-filters.html',
  styleUrl: './orders-table-filters.css',
})
export class OrdersTableFilters {
  @Input() searchTerm = '';
  @Input() selectedOrderStatus: 'ALL' | OrderStatus = 'ALL';
  @Input() selectedPaymentStatus: 'ALL' | PaymentStatus = 'ALL';
  @Input() selectedSortField: OrderSortField = 'date';
  @Input() selectedSortDirection: SortDirection = 'desc';
  @Input() orderStatusOptions: Array<'ALL' | OrderStatus> = [];
  @Input() paymentStatusOptions: Array<'ALL' | PaymentStatus> = [];
  @Input() sortFields: ReadonlyArray<{ label: string; value: OrderSortField }> = [];

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedOrderStatusChange = new EventEmitter<'ALL' | OrderStatus>();
  @Output() selectedPaymentStatusChange = new EventEmitter<'ALL' | PaymentStatus>();
  @Output() selectedSortFieldChange = new EventEmitter<OrderSortField>();
  @Output() selectedSortDirectionChange = new EventEmitter<SortDirection>();

  onSearchTermChange(value: string): void {
    this.searchTermChange.emit(value);
  }

  onOrderStatusChange(value: 'ALL' | OrderStatus): void {
    this.selectedOrderStatusChange.emit(value);
  }

  onPaymentStatusChange(value: 'ALL' | PaymentStatus): void {
    this.selectedPaymentStatusChange.emit(value);
  }

  onSortFieldChange(value: OrderSortField): void {
    this.selectedSortFieldChange.emit(value);
  }

  onSortDirectionChange(value: SortDirection): void {
    this.selectedSortDirectionChange.emit(value);
  }
}
