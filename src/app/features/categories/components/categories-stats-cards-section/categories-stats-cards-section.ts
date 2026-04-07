import { Component, Input } from '@angular/core';
import { CategoryStatsCard } from '../../models/categories.model';

@Component({
  selector: 'app-categories-stats-cards-section',
  standalone: false,
  templateUrl: './categories-stats-cards-section.html',
  styleUrl: './categories-stats-cards-section.css',
})
export class CategoriesStatsCardsSection {
  @Input() statsCards: CategoryStatsCard[] = [];
}
