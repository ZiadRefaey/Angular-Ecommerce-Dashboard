import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UpdateOrderStatus } from '../../models/orders.model';

type OrderWorkflowStatus = UpdateOrderStatus;

@Component({
  selector: 'app-order-details-workflow',
  standalone: false,
  templateUrl: './order-details-workflow.html',
  styleUrl: './order-details-workflow.css',
})
export class OrderDetailsWorkflow {
  private currentStatus: OrderWorkflowStatus = 'pending';
  @Output() statusChange = new EventEmitter<OrderWorkflowStatus>();

  @Input() set status(value: string) {
    this.currentStatus = this.normalizeStatus(value) || 'pending';
  }

  get status(): OrderWorkflowStatus {
    return this.currentStatus;
  }

  setSelectedStatus(status: OrderWorkflowStatus): void {
    this.currentStatus = status;
    this.statusChange.emit(status);
  }

  isSelected(action: OrderWorkflowStatus): boolean {
    return this.currentStatus === action;
  }

  getVariant(action: OrderWorkflowStatus): 'primary' | 'outline' | 'danger' | 'danger-outline' {
    if (action === 'cancelled') {
      return this.isSelected(action) ? 'danger' : 'danger-outline';
    }

    return this.isSelected(action) ? 'primary' : 'outline';
  }

  private normalizeStatus(status: string): OrderWorkflowStatus | '' {
    switch (status.trim().toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'shipped':
      case 'ship order':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
      case 'canceled':
      case 'cancel order':
        return 'cancelled';
      case 'confirmed':
        return 'processing';
      default:
        return '';
    }
  }
}
