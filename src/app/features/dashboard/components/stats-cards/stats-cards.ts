import { Component, Input } from '@angular/core';
import { DashboardStat } from '../../models/dashboard-stat.model';

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.html',
  styleUrls: ['./stats-cards.css'],
  standalone: false,
})
export class StatsCards {
  @Input() stats: DashboardStat[] = [];

  getIconBgClass(icon: string): string {
    switch (icon) {
      case 'users':
        return 'bg-[#eef4ff] text-[#2f6bff]';
      case 'products':
        return 'bg-[#f3f6fb] text-[#5a6578]';
      case 'categories':
        return 'bg-[#f3f6fb] text-[#5a6578]';
      case 'orders':
        return 'bg-[#f3f6fb] text-[#5a6578]';
      case 'revenue':
        return 'bg-[#eef4ff] text-[#2f6bff]';
      default:
        return 'bg-[#f3f6fb] text-[#5a6578]';
    }
  }
}
