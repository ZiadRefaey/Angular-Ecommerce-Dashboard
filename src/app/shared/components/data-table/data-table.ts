import { Component, Input, TemplateRef } from '@angular/core';
import { DataTableColumn } from '../models/data-table.model';
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css'],
  standalone: false,
})
export class DataTable<T = any> {
  @Input() data: T[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() minWidth = '100%';
  @Input() showHeader = true;
  @Input() cardClass = '';

  @Input() topLeftTemplate?: TemplateRef<any>;
  @Input() topRightTemplate?: TemplateRef<any>;
  @Input() bodyTemplate?: TemplateRef<any>;
  @Input() footerTemplate?: TemplateRef<any>;

  getHeaderAlignClass(align?: string): string {
    switch (align) {
      case 'center':
        return '!text-center';
      case 'right':
        return '!text-right';
      default:
        return '!text-left';
    }
  }

  getBodyAlignClass(align?: string): string {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  }
}
