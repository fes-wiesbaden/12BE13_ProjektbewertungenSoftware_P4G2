import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './import-modal.html',
})
export class ImportModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  isDragOver = false;

  onClose() {
    this.close.emit();
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
}
