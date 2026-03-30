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
