import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  @Input() password: string | null = null;
  @Input() show = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
