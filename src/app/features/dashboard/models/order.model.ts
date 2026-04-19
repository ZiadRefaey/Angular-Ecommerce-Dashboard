export interface Order {
  id: string;
  orderId: string;
  fullOrderId: string;
  customerName: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}
