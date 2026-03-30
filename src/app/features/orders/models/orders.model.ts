export type OrderStatus = 'Delivered' | 'Confirmed' | 'Pending' | 'Shipped' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Unpaid';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
}
