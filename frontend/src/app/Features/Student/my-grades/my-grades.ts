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
import { GradeViewerModalComponent } from '../../../Shared/Components/grade-viewer/grade-viewer';
import { TranslationService } from '../../../core/services/translation.service';
import { ManageLearningFieldService } from '../../Teacher/manage-learning-field/manage-learning-field.service';

@Component({
  selector: 'app-my-grades',
  imports: [PageHeaderComponents, TableColumnComponent, GradeViewerModalComponent],
  templateUrl: './my-grades.html',
})
export class MyGrades {
  userId!: string;
  currentLearningFieldId!: string;
  learningFields: LearningField[] = [];
  myGrades: Grade[] = [];
  loading = true;
  isAddModalVisible = false;

  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeldname' },
    { key: 'weightingHours', label: 'Gewichtung in Stunden' },
    { key: 'averageGrade', label: 'Durchschnittsnote' },
  ];
  showViewer: boolean = false;

  constructor(
    private learningFieldService: LearningFieldService,
    private authService: AuthService,
    public i18n: TranslationService,
    private manageLearningFieldService: ManageLearningFieldService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadLearningFields();
  }

  openGradeModal(item: LearningField) {
    this.loading = true;
    this.showViewer = true;
    this.showGrade(item.id);
  }

  loadLearningFields() {
    this.learningFieldService.getAllLearningFieldsByUserId(this.userId).subscribe({
      next: (data) => {
        this.learningFields = data;
        this.loading = false;
        this.learningFields.forEach((lf) => {
          this.manageLearningFieldService
            .getAverageGrade(this.userId, lf.id)
            .subscribe({
              next: (avg) => {
                lf.averageGrade = avg.averageGrade;
                lf.weightSum = avg.weightSum;
                lf.gradeCount = avg.gradeCount;
              },
              error: (err) => {
                console.error(
                  `Fehler beim Laden der Durchschnittsnote für Lernfeld ${lf.id}`,
                  err,
                );
              },
            });
        });
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lernfelder', err);
        this.loading = false;
      },
    });
  }

  showGrade(learningFieldId: string) {
    this.learningFieldService.getGradeByUserId(this.userId, learningFieldId).subscribe({
      next: (data) => {
        this.myGrades = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Noten', err);
        this.loading = false;
      },
    });
  }
}
