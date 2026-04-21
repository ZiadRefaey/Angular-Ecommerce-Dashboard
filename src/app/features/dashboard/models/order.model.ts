export interface Order {
  id: string;
  orderId: string;
  fullOrderId: string;
  customerName: string;
  customerEmail: string;
  customerInitial: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}
