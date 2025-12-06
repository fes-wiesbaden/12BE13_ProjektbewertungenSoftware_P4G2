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

  @Output() save = new EventEmitter<{ newGrades: Grade[]; updatedGrades: Grade[] }>();
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
    this.initialData.forEach((d) => this.addRow(d));
  }

  addRow(data?: any) {
  const isLoaded = !!data;

  const group = this.fb.group({
    id: [data?.id || null], // neue Zeilen haben null
    gradeName: [{ value: data?.gradeName || '', disabled: !!data }, Validators.required],
    value: [{ value: data?.value || '', disabled: !!data }, Validators.required],
    gradeWeighting: [{ value: data?.gradeWeighting || '', disabled: !!data }, Validators.required],
    isLoaded: [isLoaded],
    editing: [!data],
  });

  this.grades.push(group);
}

  toggleEdit(index: number) {
    const row = this.grades.at(index);

    row.get('gradeName')?.enable();
    row.get('value')?.enable();
    row.get('gradeWeighting')?.enable();

    row.get('isLoaded')?.setValue(false);
  }

  removeRow(index: number) {
    this.grades.removeAt(index);
  }

  onSave() {
  const allGrades = this.grades.controls.map(c => c.value);

  const newGrades = allGrades.filter(g => !g.id); // keine ID → neu
  const updatedGrades = allGrades.filter(g => g.id && !g.isLoaded); // ID vorhanden & bearbeitet

  this.save.emit({ newGrades, updatedGrades });
}

  onClose() {
    this.close.emit();
  }
}
