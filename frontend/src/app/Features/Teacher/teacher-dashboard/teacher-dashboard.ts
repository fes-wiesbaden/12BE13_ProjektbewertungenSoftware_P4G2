import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Class } from '../../../Interfaces/class.interface';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { ClassService } from '../../Admin/manage-classes/class.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { TeacherDashboardService } from './teacher-dashboard.service';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PageHeaderComponents,
    TableColumnComponent,
    FormModalComponent,
  ],
  templateUrl: './teacher-dashboard.html',
})
export class TeacherDashboard {
  classes: Class[] = [];
  myClasses: Class[] = [];
  loading = true;

  columns: TableColumn<Class>[] = [
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
  editingClass: Class | null = null;
  addClass: Class | null = null;

  constructor(private classService: TeacherDashboardService) {}

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

  openEditModal(schoolClass: Class) {
    this.editingClass = schoolClass;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingClass = null;
  }

  loadMyClasses() {
    this.classService.getMyClasses().subscribe({
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
    this.classService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;

        const courseField = this.fields.find((f) => f.key === 'courseName');
        if (courseField) {
          courseField.options = data.map((c) => c.courseName);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Klassen', err);
        this.loading = false;
      },
    });
  }

  joinClass(formData: any) {
    const selectedName = formData.courseName;

    const selectedClass = this.classes.find((c) => c.courseName === selectedName);

    if (!selectedClass) {
      console.error('Keine Klasse mit dem Namen gefunden:', selectedName);
      return;
    }

    const dto = { id: selectedClass.id };

    this.classService.connectClass(dto).subscribe({
      next: () => console.log('User erfolgreich zur Klasse hinzugefügt'),
      error: (err) => console.error('Fehler beim Hinzufügen zur Klasse', err),
    });
    this.closeAddModal();
  }
}
