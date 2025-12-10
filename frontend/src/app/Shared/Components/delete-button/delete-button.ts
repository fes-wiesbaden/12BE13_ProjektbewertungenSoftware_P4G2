import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-button',
  imports: [MatIconModule],
  templateUrl: './delete-button.html',
})
export class DeleteButtonComponent {
  @Input() showModal = false;
  @Input() title = 'Are you sure you want to delete this item?';
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
  onDelete() {
    this.delete.emit();
    this.close.emit();
  }
}
