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

import { CourseService } from '../../../Shared/Services/course.service';
import { Course } from '../../../Shared/models/course.interface';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';

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
  loading = true;
  showImportModal = false;
  showExportModal = false;
  showDeleteModal: boolean = false;
  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }

  columns: TableColumn<Course>[] = [
    { key: 'courseName', label: 'Kursname' },
    { key: 'className', label: 'Klassenname' },
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
  ];

  showAddModel = false;
  showEditModal = false;
  editingClass: Course | null = null;
  deletingClass: Course | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }

  openEditModal(schoolClass: Course) {
    this.editingClass = schoolClass;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingClass = null;
  }

  openDeleteModal(admin: Course) {
    this.deletingClass = admin;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingClass = null;
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
    };

    this.courseService.updateCourse(dto).subscribe({
      next: (res: Course) => {
        const index = this.classes.findIndex((s) => s.id === res.id);
        if (index !== -1) this.classes[index] = res;
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  deleteCourse() {
    if (!this.deletingClass) return;

    const idToDelete = this.deletingClass.id;
    this.courseService.deleteCourse(idToDelete).subscribe({
      next: () => {
        this.classes = this.classes.filter((s) => s.id !== idToDelete);
        this.deletingClass = null;
        this.closeDeleteModal();
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }
}
