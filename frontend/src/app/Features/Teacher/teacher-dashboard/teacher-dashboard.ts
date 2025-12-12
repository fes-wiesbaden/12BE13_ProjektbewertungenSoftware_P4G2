import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField } from '../../../Shared/Components/form-modal/form-modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { Router } from '@angular/router';
import { CourseService } from '../../../Shared/Services/course.service';
import { Course } from '../../../Shared/models/course.interface';
import { ImportModalComponent } from '../../../Shared/Components/import-modal/import-modal';
import { ExportModalComponent } from '../../../Shared/Components/export-modal/export-modal';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [CommonModule, FormsModule, MatIconModule, PageHeaderComponents, TableColumnComponent, ImportModalComponent,
          ExportModalComponent],
  templateUrl: './teacher-dashboard.html',
})
export class TeacherDashboard {
  classes: { label: string; value: any }[] = [];
  myClasses: Course[] = [];
  loading = true;
  public classId: string = '';
  showImportModal = false;
  showExportModal = false;
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
      type: 'select',
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
  ];

  showAddModal = false;
  showEditModal = false;
  editingClass: Course | null = null;
  addClass: Course | null = null;

  constructor(
    private router: Router,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.loadMyClasses();
    this.loadAllClasses();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(schoolClass: Course) {
    this.editingClass = schoolClass;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingClass = null;
  }

  openClassDetail(item: any) {
    const courseId = item.id;
    const courseName = item.courseName;
    this.router.navigate(['/teacher/my-students', courseId , courseName]);
  }

  loadMyClasses() {
    this.courseService.getCoursesByUser().subscribe({
      next: (data) => {
        this.myClasses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }

  loadAllClasses() {
    this.courseService.getAvailableCourses().subscribe({
      next: (data) => {
        const formatted = data.map((c) => ({
          label: c.courseName,
          value: c.id,
        }));

        this.classes = formatted;

        const courseField = this.fields.find((f) => f.key === 'courseName');
        if (courseField) {
          courseField.options = formatted;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }
}
