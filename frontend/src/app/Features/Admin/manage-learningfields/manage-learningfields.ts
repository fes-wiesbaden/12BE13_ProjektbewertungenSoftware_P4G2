import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningField } from '../../../Interfaces/learningfields.interface';
import { LearningFieldService } from './learningfields.service';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';

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

  columns: TableColumn<LearningField>[] = [
    { key: 'name', label: 'Lernfeld' },
    { key: 'description', label: 'Beschreibung' },
    { key: 'weighting', label: 'Gewichtung in %' },
  ];

  fields: FormField[] = [
    {
      key: 'learningFieldText',
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
      key: 'weight',
      label: 'Gewichtung',
      type: 'number',
      required: true,
      placeholder: 'Gewichtung 0 - 99',
      max: 99,
      colSpan: 6,
    },
  ];

  editingLearningfields: LearningField | null = null;
  toDeleteLearnField: LearningField | null = null;

  constructor(private learningfieldService: LearningFieldService) {}

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

    const dto = {
      id: this.editingLearningfields.id,
      name: formData.learningFieldText,
      description: formData.description,
      weighting: formData.weight,
    };

    this.learningfieldService.updateLearningfields(dto).subscribe({
      next: (res: LearningField) => {
        const index = this.learnfields.findIndex((s) => s.id === dto.id);
        if (index !== -1) {
          this.learnfields[index] = res;
        }
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadLearningfields() {
    this.learningfieldService.getLearningfields().subscribe({
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
    if (!Number.isInteger(Number(formData.weight)) || formData.weight < 0 || formData.weight > 99) {
      alert('Gewichtung muss eine ganze Zahl zwischen 0 und 99 sein.');
      return;
    }
    const dto = {
      name: formData.learningFieldText,
      description: formData.description,
      weighting: formData.weight,
    };

    this.learningfieldService.createLearningfields(dto).subscribe({
      next: (learnfield) => {
        this.learnfields.push(learnfield); // direkt zur Liste hinzufügen
        this.closeAddModel();
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteLearningField() {
    if (!this.toDeleteLearnField) return;

    const idToDelete = this.toDeleteLearnField.id;

    this.learningfieldService.deleteLearnField(this.toDeleteLearnField).subscribe({
      next: () => {
        this.learnfields = this.learnfields.filter((s) => s.id !== idToDelete);
        this.toDeleteLearnField = null;
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }
}
