import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ClassService } from './class.service';
import { Class } from '../../../Interfaces/class.interface';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import {
  FormField,
  FormModalComponent,
} from '../../../Shared/Components/form-modal/form-modal';

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
  ],
  templateUrl: './manage-classes.html',
})
export class ManageClasses implements OnInit {
  classes: Class[] = [];
  loading = true;

  // Tabellen-Spalten: keys müssen zum Interface "Class" passen
  columns: TableColumn<Class>[] = [
    { key: 'courseName', label: 'Kursname' },
    { key: 'className', label: 'Klassenname' },
  ];

  // Felder für "neu anlegen"
  fields: FormField[] = [
    {
      key: 'courseName',        // Name im Form-Objekt
      label: 'Kursname',
      type: 'text',
      required: true,
      colSpan: 6,
      placeholder: 'z.B. 23FIIRG1',
    },
  ];

  // Felder für "bearbeiten"
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
  editingClass: Class | null = null;

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }

  openEditModal(schoolClass: Class) {
    this.editingClass = schoolClass;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingClass = null;
  }

  loadClasses() {
    this.classService.getClasses().subscribe({
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

  // Neues Objekt speichern
  saveClass(formData: any) {
    // formData.courseName kommt vom FormModal
    const dto = {
      name: formData.courseName, // Backend erwartet Feld "name"
    };

    this.classService.createClass(dto).subscribe({
      next: (schoolclass) => {
        this.classes.push(schoolclass);
        this.closeAddModel();
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  // Bestehende Klasse bearbeiten
  saveEdit(formData: any) {
    if (!this.editingClass) return;

    const dto = {
      id: this.editingClass.id,
      name: formData.courseName, // wieder Mapping zum Backend-DTO
    };

    this.classService.updateClass(dto).subscribe({
      next: (res: Class) => {
        const index = this.classes.findIndex((s) => s.id === res.id);
        if (index !== -1) this.classes[index] = res;
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }
}
