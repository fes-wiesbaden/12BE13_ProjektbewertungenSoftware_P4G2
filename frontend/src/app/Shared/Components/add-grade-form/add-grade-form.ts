import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Grade } from '../../../Interfaces/grade.interface';

@Component({
  selector: 'app-add-grade-form',
  imports: [CommonModule, FormsModule, MatIconModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './add-grade-form.html',
})
export class AddGradeForm implements OnInit {
  @Input() showModal = false;
  @Input() title = 'Noten bearbeiten';
  @Input() initialData: Grade[] = [];

  @Output() save = new EventEmitter<Grade[]>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      grades: this.fb.array([]),
    });
    this.loadInitialData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && !changes['initialData'].firstChange) {
      this.loadInitialData();
    }
  }

  get grades(): FormArray {
    return this.form.get('grades') as FormArray;
  }

  private loadInitialData() {
    this.grades.clear();
    this.initialData.forEach((d) => this.addRow(d, true));
  }

  addRow(data?: any, disabled: boolean = false) {
  const group = this.fb.group({
    gradeName: [{ value: data?.gradeName || '', disabled }, Validators.required],
    value: [{ value: data?.value || '', disabled }, Validators.required],
    gradeWeighting: [{ value: data?.gradeWeighting || '', disabled }, Validators.required],
  });
  this.grades.push(group);
}

  removeRow(index: number) {
    this.grades.removeAt(index);
  }

  onSave() {
    // nur die neuen (nicht-disabled) Noten zurückgeben
    const newGrades = this.grades.controls
      .filter((c) => !c.get('gradeName')?.disabled)
      .map((c) => c.value);
    this.save.emit(newGrades);
  }

  onClose() {
    this.close.emit();
  }
}
