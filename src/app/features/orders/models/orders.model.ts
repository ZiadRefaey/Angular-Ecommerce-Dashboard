import { StatusBadgeVariant } from '../../../shared/components/status-badge/status-badge';

export type OrderStatus = 'Delivered' | 'Confirmed' | 'Pending' | 'Shipped' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Unpaid';

export interface OrderUserResponse {
  _id: string;
  name: string;
  email: string;
}

export interface OrderItemProductResponse {
  _id: string;
  name: string;
  price: number;
}

export interface OrderItemResponse {
  product: OrderItemProductResponse;
  quantity: number;
  variationId: string;
}

export interface OrderResponseItem {
  _id: string;
  user: OrderUserResponse;
  items: OrderItemResponse[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  message: string;
  data: OrderResponseItem[];
}

export interface Order {
  id: string;
  orderId: string;
  fullOrderId: string;
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
