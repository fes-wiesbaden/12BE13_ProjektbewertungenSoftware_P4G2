import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { User } from '../../../Interfaces/user.interface';

@Component({
  selector: 'app-delete-button',
  imports: [MatIconModule],
  templateUrl: './delete-button.html',
})
export class DeleteButton {
  @Input() showModal = false;
  @Input() title = 'New Item';
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<User>();


  onClose() {
    this.close.emit();
  }
  onDelete() {
    this.delete.emit();
    this.close.emit();
  }
}
