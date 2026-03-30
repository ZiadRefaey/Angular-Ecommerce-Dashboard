import { Component, Input } from '@angular/core';
export type StatusBadgeVariant = 'success' | 'primary' | 'warning' | 'info' | 'danger' | 'neutral';

@Component({
  selector: 'app-status-badge',
  standalone: false,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  @Input() label = '';
  @Input() variant: StatusBadgeVariant = 'neutral';

  get badgeClasses(): string {
    switch (this.variant) {
      case 'success':
        return 'bg-[#ecfdf3] text-[#027a48]';
      case 'primary':
        return 'bg-[#eef4ff] text-[#175cd3]';
      case 'warning':
        return 'bg-[#fffaeb] text-[#b54708]';
      case 'info':
        return 'bg-[#ecfdff] text-[#0e7090]';
      case 'danger':
        return 'bg-[#fef3f2] text-[#d92d20]';
      default:
        return 'bg-[#f2f4f7] text-[#344054]';
    }
  }
}
