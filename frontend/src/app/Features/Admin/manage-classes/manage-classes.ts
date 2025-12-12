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
import { LearningField } from '../../../Shared/models/learning-fields.interface';

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
  classes: (Course & { learnfieldNames?: string })[] = [];
  schoolClass: AddCourse[] = [];
  learningFields: LearningField[] = [];
  loading = true;
  showAddModel = false;
  showEditModal = false;
  showDeleteModal = false;
  showImportModal = false;
  showExportModal = false;
  editingClass: Course | null = null;
  deletingClass: Course | null = null;

  columns: TableColumn<Course & { learnfieldNames?: string }>[] = [
    { key: 'courseName', label: 'Kursname' },
    { key: 'className', label: 'Klassenname' },
    { key: 'learnfieldNames', label: 'Lernfelder' },
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
      key: 'learnfields',
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
      key: 'learnfields',
      label: 'Lernfelder',
      type: 'multiselect',
      required: true,
      colSpan: 6,
      options: [],
    },
  ];

  constructor(
    private courseService: CourseService,
    private learningFieldService: LearningFieldService,
  ) {}

  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }
  ngOnInit(): void {
    this.loadLearningFields();
  }

  loadLearningFields() {
    this.learningFieldService.getAllLearningFields().subscribe({
      next: (fields) => {
        this.learningFields = fields;

        const options = fields.map((lf) => ({ label: lf.name, value: lf.id }));
        this.fields.find((f) => f.key === 'learnfields')!.options = options;
        this.fieldsEdit.find((f) => f.key === 'learnfields')!.options = options;

        // Kurse laden, nachdem Lernfelder verfügbar sind
        this.loadClasses();
      },
      error: (err) => console.error('Fehler beim Laden der Lernfelder', err),
    });
  }

  private getLearnfieldNames(ids: string[]): string {
    return (ids ?? [])
      .map((id) => this.learningFields.find((lf) => lf.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }

  private loadClasses() {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        console.log(data);
        // Learnfield-Namen setzen
        this.classes = data.map((course) => ({
          ...course,
          learnfieldNames: this.getLearnfieldNames(course.learnfields ?? []),
        }));

        console.log('dwd', this.classes[0].learnfieldNames);
        // schoolClass für DTO vorbereiten
        this.schoolClass = data.map((course) => ({
          name: course.courseName ?? 'Unbekannt',
          learnfields: (course.learnfields ?? []).map((id) => {
            const lf = this.learningFields.find((lf) => lf.id === id);
            return lf ?? { id, name: 'Unbekannt', description: '', weightingHours: 0 };
          }),
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }

  saveClass(formData: any) {
    const dto: AddCourse = { name: formData.courseName, learnfields: formData.learnfields };

    this.courseService.createCourse(dto).subscribe({
      next: (res) => {
        const course: Course & { learnfieldNames?: string } = {
          id: res.id ?? Math.random().toString(36).slice(2, 9),
          courseName: res.courseName ?? dto.name,
          className: res.className ?? '',
          learnfields: res.learnfields ?? dto.learnfields,
          learnfieldNames: this.getLearnfieldNames(res.learnfields ?? dto.learnfields),
        };
        this.classes.push(course);
        this.closeAddModel();
      },
      error: (err) => console.error('Fehler beim Erstellen', err),
    });
  }

  saveEdit(formData: any) {
    if (!this.editingClass) return;

    const dto = {
      id: this.editingClass.id,
      name: formData.courseName,
      learnfields: formData.learnfields,
    };

    this.courseService.updateCourse(dto).subscribe({
      next: (res: any) => {
        const index = this.classes.findIndex((c) => c.id === res.id);
        if (index !== -1) {
          this.classes[index] = {
            ...this.classes[index],
            courseName: res.courseName ?? dto.name,
            learnfields: res.learnfields ?? dto.learnfields,
            learnfieldNames: this.getLearnfieldNames(res.learnfields ?? dto.learnfields),
          };
        }
        this.closeEditModal();
      },
      error: (err) => console.error('Fehler beim Aktualisieren', err),
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
