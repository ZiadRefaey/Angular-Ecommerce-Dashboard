import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.html',
  styleUrls: ['./stats-card.css'],
  standalone: false,
})
export class StatsCard {
  @Input() iconClass = '';
  @Input() iconColorClass = '';
  @Input() iconBgClass = '';
  @Input() title = '';
  @Input() value = '';
}
