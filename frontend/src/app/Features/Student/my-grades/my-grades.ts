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

@Component({
  selector: 'app-my-grades',
  imports: [PageHeaderComponents, TableColumnComponent],
  templateUrl: './my-grades.html',
})
export class MyGrades {
  userId!: string;
  currentLearningFieldId!: string;
  learningFields: LearningField[] = [];
  grades: Grade[] = [];
  loading = true;
  isAddModalVisible = false;

  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeldname' },
    { key: 'weighting', label: 'Gewichtung' },
  ];

  constructor(private learningFieldService: LearningFieldService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadLearningFields();
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
