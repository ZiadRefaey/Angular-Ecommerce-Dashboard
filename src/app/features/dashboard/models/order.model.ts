export interface Order {
  orderId: string;
  customerName: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}
