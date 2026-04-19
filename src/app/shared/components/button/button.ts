import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  @Input() label = '';
  @Input() variant: 'primary' | 'outline' | 'danger' | 'danger-outline' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() icon = '';
}
