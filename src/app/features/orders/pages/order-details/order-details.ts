import { Component } from '@angular/core';

import { IOrderDetails } from '../../models/orders.model';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails {
  order: IOrderDetails = {
    id: '#ORD-2026-001',
    status: 'pending',
    date: 'April 2, 2026',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
  };

  customer = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+20 100 123 4567',
  };

  address = {
    street: '123 Main Street',
    city: 'Cairo',
    state: 'Cairo Governorate',
    postalCode: '11728',
    country: 'Egypt',
  };

  summary = {
    subtotal: '$240.00',
    discount: '-$20.00',
    shippingFee: '$10.00',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    coupon: 'SPRING20',
    total: '$230.00',
  };

  notes = '';
}
