import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-details-summary-card',
  standalone: false,
  templateUrl: './order-details-summary-card.html',
  styleUrl: './order-details-summary-card.css',
})
export class OrderDetailsSummaryCard {
  @Input() summary = {
    subtotal: '$240.00',
    discount: '-$20.00',
    shippingFee: '$10.00',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    coupon: 'SPRING20',
    total: '$230.00',
  };
}
