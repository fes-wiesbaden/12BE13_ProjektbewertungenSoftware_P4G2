import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export type FormFieldType = 'text' | 'password' | 'email' | 'number' | 'select' | 'textarea';

export interface FormField {
  key: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  value?: any;
  readonly?: boolean;
  colSpan?: number;
}

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSelectModule],
  templateUrl: './form-modal.html',
})
export class FormModalComponent implements OnChanges {
  @Input() showModal = false;
  @Input() title = 'New Item';
  @Input() fields: FormField[] = [];
  @Input() record: any = {};

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData: Record<string, any> = {};

  ngOnChanges() {
    this.fields.forEach((f) => (this.formData[f.key] = f.value || ''));
  }

  onSave() {
    if (this.isFieldEmpty()) {
      this.save.emit(this.formData);
    } else {
      alert('Es gibt noch leere Felder!');
    }
  }

  onClose() {
    this.close.emit();
  }

  isFieldEmpty(): boolean {
    const allFilled = Object.values(this.formData).every(
      (v) => v !== '' && v !== null && v !== undefined
    );
    return allFilled;
  }
}
