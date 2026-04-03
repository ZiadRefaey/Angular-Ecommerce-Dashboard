import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-details-shipping-card',
  standalone: false,
  templateUrl: './order-details-shipping-card.html',
  styleUrl: './order-details-shipping-card.css',
})
export class OrderDetailsShippingCard {
  @Input() address = {
    street: '123 Main Street',
    city: 'Cairo',
    state: 'Cairo Governorate',
    postalCode: '11728',
    country: 'Egypt',
  };
}
