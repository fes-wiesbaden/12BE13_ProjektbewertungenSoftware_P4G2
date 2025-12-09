import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export type FormFieldType = 'text' | 'password' | 'email' | 'number' | 'select' | 'textarea';

export interface FormFieldOption {
  label: string;
  value: any;
  selected?: boolean;
}

export interface FormField {
  key: string;
  label: string;
  type: FormFieldType | 'multiselect';
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  value?: any;
  readonly?: boolean;
  colSpan?: number;
  /** validation rules */
  min?: number;
  max?: number;
  integer?: boolean;

  selected?: FormFieldOption[];
  open?: boolean;
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
  multiField?: FormField;

  formData: Record<string, any> = {};

  ngOnChanges() {
    this.fields.forEach((f) => {
      this.formData[f.key] = f.value || '';

      if (f.type === 'multiselect') {
        f.selected = f.options?.filter((o) => o.selected) || [];
        f.open = false;
      }
    });
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

  onMultiSelectChange(field: FormField) {
    if (!field.options) return;
    field.selected = field.options.filter((o) => o.selected);
    this.formData[field.key] = field.selected.map((o) => o.value);
  }

  getSelectedLabels(field: FormField): string {
    return field.selected?.length
      ? field.selected.map((s) => s.label).join(', ')
      : 'Bitte auswählen';
  }
}
