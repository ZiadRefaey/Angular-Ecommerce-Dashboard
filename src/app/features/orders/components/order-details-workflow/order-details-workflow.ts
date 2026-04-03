import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-details-workflow',
  standalone: false,
  templateUrl: './order-details-workflow.html',
  styleUrl: './order-details-workflow.css',
})
export class OrderDetailsWorkflow {
  @Input() status = 'Pending';
}
