import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Grade } from '../../../Interfaces/grade.interface';

@Component({
  selector: 'app-add-grade-form',
  imports: [
    CommonModule, FormsModule, MatIconModule, MatSelectModule, ReactiveFormsModule
  ],
  templateUrl: './add-grade-form.html'
})
export class AddGradeForm implements OnInit {
  @Input() showModal = false;
  @Input() title = 'Noten bearbeiten';
  @Input() initialData: any[] = [];

  @Output() save = new EventEmitter<Grade[]>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      grades: this.fb.array([])
    });

    this.initialData.forEach(d => this.addRow(d));
  }

  get grades() {
    return this.form.get('grades') as FormArray;
  }

  addRow(data?: any) {
    const group = this.fb.group({
      gradeName: [data?.gradeName || '', Validators.required],
      value: [data?.value || '', Validators.required],
      lastName: [data?.lastName || '', Validators.required],
    });
    this.grades.push(group);
  }

  removeRow(index: number) {
    this.grades.removeAt(index);
  }

  onSave() {
    this.save.emit(this.form.value.grades);
  }

  onClose() {
    this.close.emit();
  }
}
