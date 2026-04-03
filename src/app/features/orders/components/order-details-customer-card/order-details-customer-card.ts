import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-details-customer-card',
  standalone: false,
  templateUrl: './order-details-customer-card.html',
  styleUrl: './order-details-customer-card.css',
})
export class OrderDetailsCustomerCard {
  @Input() customer = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+20 100 123 4567',
  };
}
