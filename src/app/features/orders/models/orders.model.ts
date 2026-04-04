import { StatusBadgeVariant } from '../../../shared/components/status-badge/status-badge';

export type OrderStatus = 'Delivered' | 'Confirmed' | 'Pending' | 'Shipped' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Unpaid';

export interface Order {
  id: string | number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
}

export interface OrderStatsCard {
  iconClass: string;
  iconWrapperClass: string;
  title: string;
  value: string;
}
export interface IOrderDetails {
  id: string;
  status: StatusBadgeVariant;
  date: string;
  paymentStatus: string;
  paymentMethod: string;
}
export interface IOrderItem {
  id: number;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
