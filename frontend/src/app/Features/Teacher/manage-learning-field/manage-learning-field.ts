import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManageLearningFieldService } from './manage-learning-field.service';
import { LearningField } from '../../../Interfaces/learning-field.interface';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { AddGradeForm } from '../../../Shared/Components/add-grade-form/add-grade-form';
import { Grade } from '../../../Interfaces/grade.interface';

@Component({
  selector: 'app-manage-learning-field',
  imports: [PageHeaderComponents, TableColumnComponent, AddGradeForm],
  templateUrl: './manage-learning-field.html',
})
export class ManageLearningField {
  studentId!: string;
  learningFields: LearningField[] = [];
  grades: Grade[] = [];
  loading = true;
  isAddModalVisible = false;

  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeldname' },
    { key: 'weighting', label: 'Gewichtung' },
  ];

  constructor(
    private route: ActivatedRoute,
    private manageLearningFieldService: ManageLearningFieldService
  ) {}

  openAddModal(item: any) {
    this.manageLearningFieldService.getGrades(item.id, this.studentId).subscribe({
      next: (data) => {
        this.grades = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lernfelder', err);
        this.loading = false;
      },
    });
    this.isAddModalVisible = true;
  }

  closeAddModal() {
    this.isAddModalVisible = false;
  }

  onSaveGrades(grades: any[]) {
    this.isAddModalVisible = false;
  }

  ngOnInit(): void {
    const studentIdParam = this.route.snapshot.paramMap.get('studentId');
    if (!studentIdParam) {
      console.error("Missing or invalid 'studentId' route parameter.");
      this.loading = false;
      return;
    }
    this.studentId = studentIdParam;
    this.loadLearningFields();
  }

  loadLearningFields() {
    this.manageLearningFieldService.getLearningField(this.studentId).subscribe({
      next: (data) => {
        this.learningFields = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lernfelder', err);
        this.loading = false;
      },
    });
  }
}
