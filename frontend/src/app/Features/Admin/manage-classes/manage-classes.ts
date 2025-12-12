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
import { LearningFieldService } from '../../../Shared/Services/learning-field.service';
import { TranslationService } from '../../../core/services/translation.service';

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
  learningFields: { label: string; value: String }[] = [];
  filteredCourses: Course[] = [];

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
    { key: 'learningFieldNames', label: 'Lernfelder' },
  ];

  filterOptions = [
    { key: 'courseName', label: 'Kursname' },
    { key: 'className', label: 'Klassenname' },
  ];

  selectedFilter = this.filterOptions[0].key;

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

  showAddModel = false;
  showEditModal = false;
  editingClass: Course | null = null;
  deletingClass: Course | null = null;

  constructor(
    private courseService: CourseService,
    private learningFieldService: LearningFieldService,
    public i18n: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadLearningFields();
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

    const selectedIds = schoolClass.learningFieldIds ?? [];

    const learningFieldField = this.fieldsEdit.find((f) => f.key === 'learningFieldIds');
    if (learningFieldField && learningFieldField.options) {
      learningFieldField.options = learningFieldField.options.map((opt) => ({
        ...opt,
        selected: selectedIds.includes(opt.value),
      }));
    }
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
        this.filteredCourses = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }

  onHeaderSearch(searchValue: string) {
    searchValue = searchValue.toLowerCase();
    this.filteredCourses = this.classes.filter((course) => {
      const value = course[this.selectedFilter as keyof Course];
      return value ? value.toString().toLowerCase().includes(searchValue) : false;
    });
  }

  onHeaderFilterChange(filterKey: string) {
    this.selectedFilter = filterKey;
    this.filteredCourses = [...this.classes];
  }

  saveClass(formData: any) {
    const dto = {
      name: formData.courseName,
      learningFieldsIds: formData.learningFieldIds,
    };

    this.courseService.createCourse(dto).subscribe({
      next: (schoolclass) => {
        this.classes.push(schoolclass);
        this.filteredCourses = [...this.classes];
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
        this.filteredCourses = [...this.classes];
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
        this.filteredCourses = [...this.classes];
        this.deletingClass = null;
        this.closeDeleteModal();
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }
}
