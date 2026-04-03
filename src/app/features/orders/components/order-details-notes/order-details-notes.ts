import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-details-notes',
  standalone: false,
  templateUrl: './order-details-notes.html',
  styleUrl: './order-details-notes.css',
})
export class OrderDetailsNotes {
  @Input() notes = '';
}
