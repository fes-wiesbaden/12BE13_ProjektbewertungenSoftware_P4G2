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
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';
import { ImportModalComponent } from '../../../Shared/Components/import-modal/import-modal';
import { ExportModalComponent } from '../../../Shared/Components/export-modal/export-modal';
import { LearningField } from '../../../Shared/models/learning-fields.interface';
import { LearningFieldService } from '../../../Shared/Services/learning-field.service';

@Component({
  selector: 'app-learnfield',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PageHeaderComponents,
    TableColumnComponent,
    FormModalComponent,
    DeleteButtonComponent,
    ImportModalComponent,
    ExportModalComponent,
  ],
  templateUrl: './manage-learningfields.html',
})
export class ManageLearnfields implements OnInit {
  learnfields: LearningField[] = [];
  loading = true;
  showAddModel: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedLearnfield: LearningField | null = null;
  showImportModal = false;
  showExportModal = false;
  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }
  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeld' },
    { key: 'description', label: 'Beschreibung' },
    { key: 'weightingHours', label: 'Stunden' },
  ];

  fields: FormField[] = [
    {
      key: 'name',
      label: 'Lernfeld',
      type: 'text',
      required: true,
      placeholder: 'Dein Lernfeld...',
      colSpan: 6,
    },
    {
      key: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      required: true,
      placeholder: 'Beschreibung',
      colSpan: 6,
    },
    {
      key: 'weightingHours',
      label: 'Stunden',
      type: 'number',
      required: true,
      placeholder: 'Stunden',
      max: 200,
      colSpan: 6,
    },
  ];

  editingLearningfields: LearningField | null = null;
  toDeleteLearnField: LearningField | null = null;

  constructor(private learningFieldService: LearningFieldService) {}

  ngOnInit(): void {
    this.loadLearningfields();
  }

  openEditModal(lernfeld: LearningField) {
    this.editingLearningfields = lernfeld;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingLearningfields = null;
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }

  openDeleteModal(learnfield: LearningField) {
    this.toDeleteLearnField = learnfield;
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.toDeleteLearnField = null;
  }

  saveEdit(formData: any) {
    if (!this.editingLearningfields) return;

    const dtoLearningfield = {
      id: this.editingLearningfields.id,
      name: formData.name,
      description: formData.description,
      weightingHours: formData.weightingHours,
    };

    this.learningFieldService.updateLearningField(dtoLearningfield).subscribe({
      next: (res: LearningField) => {
        const index = this.learnfields.findIndex((s) => s.id === dtoLearningfield.id);
        if (index !== -1) {
          this.learnfields[index] = res;
        }
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadLearningfields() {
    this.learningFieldService.getAllLearningFields().subscribe({
      next: (data) => {
        console.log('API Data:', data);
        this.learnfields = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lehrer', err);
        this.loading = false;
      },
    });
  }

  saveLearningfields(formData: any) {
    if (
      !Number.isInteger(Number(formData.weightingHours)) ||
      formData.weightingHours < 0 ||
      formData.weightingHours > 99
    ) {
      alert('Gewichtung muss eine ganze Zahl zwischen 0 und 99 sein.');
      return;
    }
    const dto = {
      name: formData.name,
      description: formData.description,
      weightingHours: formData.weightingHours,
    };
    this.learningFieldService.createLearningField(dto).subscribe({
      next: (learnfield) => {
        this.learnfields.push(learnfield);
        this.closeAddModel();
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteLearningField() {
    if (!this.toDeleteLearnField) return;

    const idToDelete = this.toDeleteLearnField.id;

    this.learningFieldService.deleteLearnField(this.toDeleteLearnField).subscribe({
      next: () => {
        this.learnfields = this.learnfields.filter((s) => s.id !== idToDelete);
        this.toDeleteLearnField = null;
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }
}
