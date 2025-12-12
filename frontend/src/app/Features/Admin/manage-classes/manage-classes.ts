import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { ImportModalComponent } from '../../../Shared/Components/import-modal/import-modal';
import { ExportModalComponent } from '../../../Shared/Components/export-modal/export-modal';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';

import { CourseService } from '../../../Shared/Services/course.service';
import { LearningFieldService } from '../../../Shared/Services/learning-field.service';
import { AddCourse, Course } from '../../../Shared/models/course.interface';

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PageHeaderComponents,
    TableColumnComponent,
    FormModalComponent,
    ImportModalComponent,
    ExportModalComponent,
    DeleteButtonComponent,
  ],
  templateUrl: './manage-classes.html',
})
export class ManageClasses implements OnInit {
  classes: Course[] = [];
  schoolClass: AddCourse[] = [];
  learningFields: { label: string; value: String }[] = [];

  loading = true;
  showAddModel = false;
  showEditModal = false;
  showDeleteModal = false;
  showImportModal = false;
  showExportModal = false;
  editingClass: Course | null = null;
  deletingClass: Course | null = null;

  columns: TableColumn<Course>[] = [
    { key: 'courseName', label: 'Kursname' },
    { key: 'className', label: 'Klassenname' },
    { key: 'learningFieldNames', label: 'Lernfelder' },
  ];

  fields: FormField[] = [
    {
      key: 'courseName',
      label: 'Kursname',
      type: 'text',
      required: true,
      colSpan: 6,
      placeholder: 'z.B. 23FIIRG1',
    },
    {
      key: 'learningFieldIds',
      label: 'Lernfelder',
      type: 'multiselect',
      required: true,
      colSpan: 6,
      options: [],
    },
  ];

  fieldsEdit: FormField[] = [
    {
      key: 'courseName',
      label: 'Kursname',
      type: 'text',
      required: true,
      colSpan: 6,
      placeholder: 'z.B. 23FIIRG1',
    },
    {
      key: 'learningFieldIds',
      label: 'Lernfelder',
      type: 'multiselect',
      required: true,
      colSpan: 6,
      options: [],
    },
  ];

  constructor(
    private courseService: CourseService,
    private learningFieldService: LearningFieldService
  ) {}

  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }
  ngOnInit(): void {
    this.loadLearningFields();
    this.loadClasses();
  }

  loadLearningFields() {
    this.learningFieldService.getAllLearningFields().subscribe({
      next: (data) => {
        this.learningFields = data.map((c: any) => ({ label: c.name, value: c.id }));

        const courseField = this.fields.find((f) => f.key === 'learningFieldIds');
        if (courseField) {
          courseField.options = this.learningFields.map((c) => ({ ...c, selected: false }));
        }
        const courseFieldEdit = this.fieldsEdit.find((f) => f.key === 'learningFieldIds');
        if (courseFieldEdit) {
          courseFieldEdit.options = this.learningFields.map((c) => ({ ...c, selected: false }));
        }
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lehrer', err);
        this.loading = false;
      },
    });
  }

  loadClasses() {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.classes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }

  saveClass(formData: any) {
    const dto = {
      name: formData.courseName,
      learningFieldsIds: formData.learningFieldIds,
    };

    this.courseService.createCourse(dto).subscribe({
      next: (schoolclass) => {
        this.classes.push(schoolclass);
        this.closeAddModel();
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  saveEdit(formData: any) {
    if (!this.editingClass) return;

    const dto = {
      id: this.editingClass.id,
      name: formData.courseName,
      learningFieldsIds: formData.learningFieldIds,
    };

    this.courseService.updateCourse(dto).subscribe({
      next: (res: Course) => {
        const index = this.classes.findIndex((s) => s.id === res.id);
        if (index !== -1) this.classes[index] = res;
        this.closeEditModal();
        this.loadClasses();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  deleteCourse() {
    if (!this.editingClass) return;

    const idToDelete = this.editingClass.id;
    this.courseService.deleteCourse(idToDelete).subscribe({
      next: () => {
        this.classes = this.classes.filter((c) => c.id !== idToDelete);
        this.deletingClass = null;
        this.closeDeleteModal();
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }

  openAddModel() {
    this.showAddModel = true;
  }
  closeAddModel() {
    this.showAddModel = false;
  }
  openEditModal(course: Course) {
    this.editingClass = course;
    this.showEditModal = true;

    const selectedIds = course.learningFieldIds ?? [];

    const learningFieldField = this.fieldsEdit.find((f) => f.key === 'learningFieldIds');
    if (learningFieldField && learningFieldField.options) {
      learningFieldField.options = learningFieldField.options.map((opt) => ({
        ...opt,
        selected: selectedIds.includes(opt.value),
      }));
    }
  }
  closeEditModal() {
    this.editingClass = null;
    this.showEditModal = false;
  }
  openDeleteModal(course: Course) {
    this.deletingClass = course;
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.deletingClass = null;
    this.showDeleteModal = false;
  }
}
