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
import { QuestionResponseDto } from '../../../Shared/models/question.interface';
import { QuestionService } from '../../../Shared/Services/question.service';
import { DeleteButtonComponent } from '../../../Shared/Components/delete-button/delete-button';
import { TranslationService } from '../../../core/services/translation.service';
import {ProjectService} from '../../../core/services/project.service';
import {IProject} from '../../../core/modals/project.modal';

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
  questions: QuestionResponseDto[] = [];
  filteredQuestions: QuestionResponseDto[] = [];
  projects: IProject[] = []; // ADD THIS
  loading = true;
  showAddModel: boolean = false;
  showEditModal: boolean = false;
  selectedQuestion: QuestionResponseDto | null = null;
  showEditModel: boolean = false;
  showImportModal = false;
  showExportModal = false;
  showDeleteModal: boolean = false;
  selectedProjectId: string = ''; // ADD THIS

  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }

  columns: TableColumn<QuestionResponseDto>[] = [
    { key: 'questionText', label: 'Frage' },
    { key: 'projectId', label: 'Projekt ID' } // ADD THIS
  ];

  fields: FormField[] = [
    {
      key: 'questionText',
      label: 'Frage',
      type: 'textarea',
      required: true,
      placeholder: 'Deine Frage...',
      colSpan: 6,
    },
    {
      key: 'projectId',
      label: 'Projekt',
      type: 'select',
      required: true,
      options: [], // Will be populated dynamically
      colSpan: 6,
    },
  ];

  editingQuestions: QuestionResponseDto | null = null;
  deletingQuestion: QuestionResponseDto | null = null;

  filterOptions = [
    { key: 'questionText', label: 'Text' },
    { key: 'projectId', label: 'Projekt ID' }, // ADD THIS
  ];

  selectedFilter = this.filterOptions[0].key;
  questionText = '';

  constructor(
    private questionService: QuestionService,
    private projectService: ProjectService, // ADD THIS
    public i18n: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadQuestions();
  }

  // ADD THIS METHOD
  loadProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        // Update the projectId field options
        const projectField = this.fields.find(f => f.key === 'projectId');
        if (projectField) {
          projectField.options = projects.map((p: any) => ({
            value: p.id,
            label: p.projectName || p.id
          }));
        }
      },
      error: (err) => {
        console.error('Fehler beim Laden der Projekte', err);
      }
    });
  }

  openEditModal(question: QuestionResponseDto) {
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

  openDeleteModal(admin: QuestionResponseDto) {
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
      next: (res: QuestionResponseDto) => {
        const index = this.questions.findIndex((s) => s.id === updatedQuestion.id);
        if (index !== -1) this.questions[index] = res;
        this.filteredQuestions = [...this.questions];
        this.closeEditModal();
      },
      error: (err: any) => console.error('Fehler beim Aktualisieren:', err),
    });
  }

  loadQuestions() {
    this.questionService.getAllQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.filteredQuestions = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Fragen', err);
        this.loading = false;
      },
    });
  }

  onHeaderSearch(searchValue: string) {
    searchValue = searchValue.toLowerCase();
    this.filteredQuestions = this.questions.filter((question) => {
      const value = question[this.selectedFilter as keyof QuestionResponseDto];
      return value ? value.toString().toLowerCase().includes(searchValue) : false;
    });
  }

  onHeaderFilterChange(filterKey: string) {
    this.selectedFilter = filterKey;
    this.filteredQuestions = [...this.questions];
  }

  // MODIFIED METHOD
  onProjectFilterChange(projectId: string) {
    this.selectedProjectId = projectId;
    if (projectId === '' || projectId === 'all') {
      this.filteredQuestions = [...this.questions];
    } else {
      this.filteredQuestions = this.questions.filter(
        (q) => q.projectId === projectId
      );
    }
  }

  // MODIFIED METHOD
  saveQuestion(formData: any) {
    const dto = {
      questionText: formData.questionText,
      projectId: formData.projectId, // ADD THIS
    };

    this.questionService.createQuestion(dto).subscribe({
      next: (question) => {
        this.questions.push(question);
        this.filteredQuestions = [...this.questions];
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
        this.filteredQuestions = [...this.questions];
        this.deletingQuestion = null;
        this.closeDeleteModal();
      },
      error: (err) => console.error('Fehler beim Löschen', err),
    });
  }

  // ADD THIS METHOD - Get project name by ID
  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id === projectId);
    return project ? (project.title || projectId) : projectId;
  }
}
