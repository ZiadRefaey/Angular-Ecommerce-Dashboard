import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() widthClass = 'max-w-[420px]';
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  isVisible = false;

  ngOnChanges(): void {
    if (this.isOpen) {
      this.isVisible = true;
    } else {
      // wait for animation before removing
      setTimeout(() => {
        this.isVisible = false;
      }, 180);
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.closed.emit();
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
