import { Component } from '@angular/core';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { Grade } from '../../../Interfaces/grade.interface';
import { LearningField } from '../../../Shared/models/learning-fields.interface';
import { LearningFieldService } from '../../../Shared/Services/learning-field.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AddGradeForm } from "../../../Shared/Components/add-grade-form/add-grade-form";
import { GradeViewerModalComponent } from "../../../Shared/Components/grade-viewer/grade-viewer";

@Component({
  selector: 'app-my-grades',
  imports: [PageHeaderComponents, TableColumnComponent, AddGradeForm, GradeViewerModalComponent],
  templateUrl: './my-grades.html'
})
export class MyGrades {
  userId!: string;
  currentLearningFieldId!: string;
  learningFields: LearningField[] = [];
  myGrades: Grade[] = [
  { id: '1', gradeName: 'LF 1', value: 5, gradeWeighting: 30 ,date:"2025-12-09T09:13:34.173+00:00"},
  { id: '2', gradeName: 'LF 2', value: 4, gradeWeighting: 70, date:"2025-12-09T09:13:34.173+00:00" }
];
  loading = true;
  isAddModalVisible = false;

  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeldname' },
    { key: 'weighting', label: 'Gewichtung' },
  ];
showViewer: any;

  constructor(private learningFieldService: LearningFieldService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadLearningFields();
  }

  openAddModal(item: any) {
    this.loading = true;
    this.showViewer= true;
  }

  loadLearningFields() {
    this.learningFieldService.getAllLearningFieldsByUserId(this.userId).subscribe({
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
