import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ImportService, ImportResult } from './import.service';

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './import-modal.html',
})
export class ImportModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();

  isDragOver = false;
  selectedFile: File | null = null;

  importType: 'users' | 'classes' | 'training-modules' = 'users';

  uploading = false;
  result: ImportResult | null = null;
  errorMessage: string | null = null;

  constructor(private importService: ImportService) {}

  onClose() {
    if (this.uploading) return;
    this.resetState();
    this.close.emit();
  }

  private resetState() {
    this.isDragOver = false;
    this.selectedFile = null;
    this.result = null;
    this.errorMessage = null;
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.fileSelected.emit(file);
      this.errorMessage = null;
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.fileSelected.emit(file);
      this.errorMessage = null;
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

  onImport() {
    if (!this.selectedFile) {
      this.errorMessage = 'Bitte zuerst eine Datei auswählen.';
      return;
    }

    this.errorMessage = null;
    this.result = null;
    this.uploading = true;

    let request$;

    switch (this.importType) {
      case 'users':
        request$ = this.importService.importUsers(this.selectedFile);
        break;
      case 'classes':
        request$ = this.importService.importClasses(this.selectedFile);
        break;
      case 'training-modules':
        request$ = this.importService.importTrainingModules(this.selectedFile);
        break;
      default:
        this.errorMessage = 'Ungültiger Import-Typ.';
        this.uploading = false;
        return;
    }

    request$.subscribe({
      next: (res) => {
        this.result = res;
        this.uploading = false;
      },
      error: (err) => {
        console.error('Import-Fehler', err);
        this.errorMessage = 'Import fehlgeschlagen. Bitte später erneut versuchen.';
        this.uploading = false;
      },
    });
  }
}
