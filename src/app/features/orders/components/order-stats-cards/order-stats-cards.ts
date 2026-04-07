import { Component, Input } from '@angular/core';
import { OrderStatsCard } from '../../models/orders.model';

@Component({
  selector: 'app-order-stats-cards',
  standalone: false,
  templateUrl: './order-stats-cards.html',
  styleUrl: './order-stats-cards.css',
})
export class OrderStatsCards {
  @Input() statsCards: OrderStatsCard[] = [];
}
