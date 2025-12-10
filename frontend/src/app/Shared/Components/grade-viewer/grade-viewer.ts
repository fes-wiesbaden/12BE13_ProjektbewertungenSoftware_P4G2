import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Grade } from '../../../Interfaces/grade.interface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-grade-viewer-modal',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './grade-viewer.html',
})
export class GradeViewerModalComponent {
  @Input() showModal = false;
  @Input() title: string = 'Notenübersicht';
  @Input() grades: Grade[] = [];

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
