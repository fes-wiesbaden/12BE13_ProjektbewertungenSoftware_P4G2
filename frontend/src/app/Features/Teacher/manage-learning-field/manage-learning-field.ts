import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManageLearningFieldService } from './manage-learning-field.service';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { AddGradeForm } from '../../../Shared/Components/add-grade-form/add-grade-form';
import { Grade } from '../../../Interfaces/grade.interface';
import { LearningField } from '../../../Shared/models/learning-fields.interface';

@Component({
  selector: 'app-manage-learning-field',
  imports: [PageHeaderComponents, TableColumnComponent, AddGradeForm],
  templateUrl: './manage-learning-field.html',
})
export class ManageLearningField implements OnInit {
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
    private route: ActivatedRoute,
    private manageLearningFieldService: ManageLearningFieldService,
  ) {}

  openAddModal(item: any) {
    this.loading = true;
    this.manageLearningFieldService.getGrades(item.id, this.studentId).subscribe({
      next: (data) => {
        this.grades = data;
        this.loading = false;
        this.currentLearningFieldId = item.id;
        this.isAddModalVisible = true;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lernfelder', err);
        this.loading = false;
      },
    });
  }

  onDeleteGrade(grade: Grade) {
    this.manageLearningFieldService
      .deleteGrade(this.studentId, this.currentLearningFieldId, grade.id)
      .subscribe({
        next: (res) => console.log('Note gelöscht', res),
        error: (err) => console.error('Fehler beim Löschen der Note', err),
      });
  }

  closeAddModal() {
    this.isAddModalVisible = false;
  }

  onSaveGrades({
    newGrades,
    updatedGrades,
    deletedGrades,
  }: {
    newGrades: Grade[];
    updatedGrades: Grade[];
    deletedGrades: Grade[];
  }) {
    newGrades.forEach((grade) => {
      this.manageLearningFieldService
        .addGrade(this.studentId, this.currentLearningFieldId, grade)
        .subscribe();
    });

    updatedGrades.forEach((grade) => {
      this.manageLearningFieldService
        .updateGrade(this.studentId, this.currentLearningFieldId, grade.id, grade)
        .subscribe();
    });

    deletedGrades.forEach((grade) => {
      this.manageLearningFieldService
        .deleteGrade(this.studentId, this.currentLearningFieldId, grade.id)
        .subscribe();
    });

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
