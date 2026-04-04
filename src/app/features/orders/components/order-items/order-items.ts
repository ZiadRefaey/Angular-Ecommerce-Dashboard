import { Component, Input } from '@angular/core';
import { IOrderItem } from '../../models/orders.model';
import { DataTableColumn } from '../../../../shared/components/models/data-table.model';

@Component({
  selector: 'app-order-items',
  standalone: false,
  templateUrl: './order-items.html',
  styleUrl: './order-items.css',
})
export class OrderItems {
  @Input() items: IOrderItem[] = [];

  columns: DataTableColumn[] = [
    { field: 'product', header: 'PRODUCT', width: '46%' },
    { field: 'quantity', header: 'QUANTITY', width: '18%', headerAlign: 'center' },
    { field: 'unitPrice', header: 'UNIT PRICE', width: '18%', headerAlign: 'center' },
    { field: 'total', header: 'TOTAL', width: '18%', headerAlign: 'right' },
  ];
}
