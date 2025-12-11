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
import { Question } from '../../../Shared/models/question.interface';
import { QuestionService } from '../../../Shared/Services/question.service';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';

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
    ImportModalComponent,
    ExportModalComponent,
    DeleteButtonComponent,
  ],
  templateUrl: './manage-question.html',
})
export class ManageQuestions implements OnInit {
  questions: Question[] = [];
  loading = true;
  showAddModel: boolean = false;
  showEditModal: boolean = false;
  selectedQuestion: Question | null = null;
  showEditModel: boolean = false;
  showImportModal = false;
  showExportModal = false;
  showDeleteModal: boolean = false;
  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }
  columns: TableColumn<Question>[] = [{ key: 'questionText', label: 'Frage' }];

  fields: FormField[] = [
    {
      key: 'questionText',
      label: 'Frage',
      type: 'textarea',
      required: true,
      placeholder: 'Deine Frage...',
      colSpan: 6,
    },
  ];

  editingQuestions: Question | null = null;
  deletingQuestion: Question | null = null;

  questionText = '';

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  openEditModal(question: Question) {
    this.editingQuestions = question;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingQuestions = null;
  }

  openAddModel(): void {
    this.showAddModel = true;
  }

  closeAddModel(): void {
    this.showAddModel = false;
  }

  openDeleteModal(admin: Question) {
    this.deletingQuestion = admin;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingQuestion = null;
  }

  saveEdit(formData: any) {
    if (!this.editingQuestions) return;

    const updatedQuestion = { ...this.editingQuestions, ...formData };

    this.questionService.updateQuestion(updatedQuestion).subscribe({
      next: (res: Question) => {
        const index = this.questions.findIndex((s) => s.id === updatedQuestion.id);
        if (index !== -1) this.questions[index] = res;
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadQuestions() {
    this.questionService.getAllQuestions().subscribe({
      next: (data) => {
        console.log('API Data:', data);
        this.questions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Lehrer', err);
        this.loading = false;
      },
    });
  }

  saveQuestion(formData: any) {
    const dto = {
      questionText: formData.questionText,
    };

    this.questionService.createQuestion(dto).subscribe({
      next: (question) => {
        this.questions.push(question);
        this.closeAddModel();
        this.questionText = '';
      },
      error: (err) => console.error('Fehler beim Erstellen:', err),
    });
  }

  deleteQuestion() {
    if (!this.deletingQuestion) return;

    const idToDelete = this.deletingQuestion.id;
    this.questionService.deleteQuestion(idToDelete).subscribe({
      next: () => {
        this.questions = this.questions.filter((s) => s.id !== idToDelete);
        this.deletingQuestion = null;
        this.closeDeleteModal();
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }
}
