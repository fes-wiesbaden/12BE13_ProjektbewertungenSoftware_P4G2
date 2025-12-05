import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManageLearningFieldService } from './manage-learning-field.service';
import { LearningField } from '../../../Interfaces/learning-field.interface';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { TableColumn, TableColumnComponent } from '../../../Shared/Components/table-column/table-column';

@Component({
  selector: 'app-manage-learning-field',
  imports: [
    PageHeaderComponents,
    TableColumnComponent,
  ],
  templateUrl: './manage-learning-field.html'
})
export class ManageLearningField {
  studentId!: string;
  learningFields: LearningField[] = [];
  loading = true;

  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeldname' },
    { key: 'weighting', label: 'Gewichtung' }
  ];

  constructor(private route: ActivatedRoute, private manageLearningFieldService: ManageLearningFieldService) {}

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
        console.log(this.learningFields);
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lernfelder', err);
        this.loading = false;
      },
    });
  }
}
