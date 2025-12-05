import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningField } from '../../../Interfaces/learningfields.interface';
import { learningfieldService } from './learningfields.service';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { FormField, FormModalComponent } from '../../../Shared/Components/form-modal/form-modal';
import { DeleteButtonComponent } from "../../../Shared/Components/delete-button/delete-button";

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PageHeaderComponents,
    TableColumnComponent,
    FormModalComponent,
    DeleteButtonComponent
],
  templateUrl: './manage-learningfields.html',
})
export class ManageLearnfields implements OnInit {
  learnfields: LearningField[] = [];
  loading = true;
  showAddModel: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal : boolean = false;
  selectedLearnfield: LearningField | null = null;

  columns: TableColumn<LearningField>[] = [{ key: 'learningFieldText', label: 'Lernfeld' }];

  fields: FormField[] = [
    {
      key: 'learningfieldsText',
      label: 'Lernfelder',
      type: 'textarea',
      required: true,
      placeholder: 'Dein Lernfeld...',
    },
  ];

  editingLearningfields: LearningField | null = null;
  deletingLearnField: LearningField | null = null;

  learningfieldtext = '';

  constructor(private learningfieldService: learningfieldService) {}

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
      this.deletingLearnField = learnfield;
      this.showDeleteModal = true;
    }
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deletingLearnField = null;
    }

  saveEdit(formData: any) {
    if (!this.editingLearningfields) return;

    const updatedLearningfields = { ...this.editingLearningfields, ...formData };

    console.log(formData);
    console.log(updatedLearningfields.id);

    this.learningfieldService.updateLearningfields(updatedLearningfields).subscribe({
      next: (res: LearningField) => {
        const index = this.learnfields.findIndex((s) => s.id === updatedLearningfields.id);
        if (index !== -1) this.learnfields[index] = res;
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
    console.log(formData);
    const dto = {
        name: formData.learningfieldsText,
        description: "formData.learningfieldsDescription",
        weighting: 0.2
    };
    console.log("dto", dto);

    this.learningfieldService.createLearningfields(dto).subscribe({
      next: (learnfield) => {
        console.log(learnfield);
        this.learnfields.push(learnfield); // direkt zur Liste hinzufügen
        this.closeAddModel();
        // Reset Form
        this.learningfieldtext = '';
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteLearningField() {
    console.log(this.deleteLearningField);
  if (!this.deletingLearnField) return;
    
  this.learningfieldService.deleteLearningField(this.deletingLearnField).subscribe({
    next: () => {
      this.learnfields = this.learnfields.filter(s => s.id !== this.deletingLearnField!.id);
    },
    error: (err) => console.error('Fehler beim Löschen', err)
  });
}
}