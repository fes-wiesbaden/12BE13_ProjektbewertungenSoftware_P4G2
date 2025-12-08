import { Component } from '@angular/core';
import { TableColumn, TableColumnComponent } from '../../../Shared/Components/table-column/table-column';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { AddGradeForm } from '../../../Shared/Components/add-grade-form/add-grade-form';
import { LearningField } from '../../../Interfaces/learningfields.interface';
import { Grade } from '../../../Interfaces/grade.interface';
import { ActivatedRoute } from '@angular/router';
import { ManageLearningFieldService } from '../../Teacher/manage-learning-field/manage-learning-field.service';
import { MyGradesService } from './my-grades.service';

@Component({
  selector: 'app-my-grades',
  imports: [PageHeaderComponents, TableColumnComponent],
  templateUrl: './my-grades.html'
})
export class MyGrades {
  studentId!: string;
  currentLearningFieldId!: string;
  learningFields: LearningField[] = [];
  grades: Grade[] = [];
  loading = true;
  isAddModalVisible = false;

  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeldname' },
    { key: 'weighting', label: 'Gewichtung' },
  ];

  constructor(
    private myGradesService: MyGradesService
  ) {}

  ngOnInit(): void {
    this.loadLearningFields();
  }

  loadLearningFields() {
    this.myGradesService.getLearningField(this.studentId).subscribe({
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
