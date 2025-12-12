import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExportService } from './export.service';
import { CourseService } from '../../Services/course.service';
import { Course } from '../../models/course.interface';
import { FormsModule } from '@angular/forms';

type ExportOptionKey =
  | 'CLASS_WITH_STUDENTS'
  | 'ALL_CLASSES_WITH_STUDENTS'
  | 'ALL_STUDENTS'
  | 'ALL_TEACHERS'
  | 'ALL_ADMINS'
  | 'ALL_USERS'
  | 'ALL_ROLES';

interface ExportOption {
  key: ExportOptionKey;
  title: string;
  description: string;
  needsClass?: boolean;
}

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule,],
  templateUrl: './export-modal.html',
})
export class ExportModalComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Input() mode: 'admin' | 'teacher' = 'admin';
  @Input() classId: string | null = null;

  private readonly ROLE_STUDENT = 2;
  private readonly ROLE_TEACHER = 1;
  private readonly ROLE_ADMIN = 3;

  options: ExportOption[] = [
    {
      key: 'CLASS_WITH_STUDENTS',
      title: 'Eine Klasse und deren Schüler exportieren',
      description: 'Exportiert alle Schüler einer ausgewählten Klasse.',
      needsClass: true,
    },
    {
      key: 'ALL_CLASSES_WITH_STUDENTS',
      title: 'Alle Klassen und deren Schüler exportieren',
      description: 'Exportiert alle Schüler mit den zugehörigen Klassen.',
    },
    {
      key: 'ALL_STUDENTS',
      title: 'Alle Schüler exportieren',
      description: 'Alle Nutzer mit der Rolle Schüler.',
    },
    {
      key: 'ALL_TEACHERS',
      title: 'Alle Lehrer exportieren',
      description: 'Alle Nutzer mit der Rolle Lehrer.',
    },
    {
      key: 'ALL_ADMINS',
      title: 'Alle Admins exportieren',
      description: 'Alle Nutzer mit der Rolle Admin.',
    },
    {
      key: 'ALL_USERS',
      title: 'Alle Nutzer exportieren',
      description: 'Alle Nutzer inklusive Rollen- und Klasseninformationen.',
    },
  ];

  selectedKey: ExportOptionKey | null = null;
  exporting = false;
  errorMessage: string | null = null;

  courses: Course[] = [];
  selectedClassId: string | null = null;

  constructor(
    private exportService: ExportService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {

    this.courseService.getAllCourses().subscribe({
      next: (data) => (this.courses = data),
      error: (err) => console.error('Fehler beim Laden der Kurse für Export', err),

    }
  );
  if (this.mode === 'teacher') {
    this.selectedKey = 'CLASS_WITH_STUDENTS';
    this.selectedClassId = this.classId;

  }
  }

  onClose() {
    if (!this.exporting) {
      this.close.emit();
      this.selectedKey = null;
      this.selectedClassId = null;
      this.errorMessage = null;
    }
  }

  selectOption(option: ExportOption) {
    if (this.mode === 'teacher') return;
    this.selectedKey = option.key;
  }

  onExport() {
    this.errorMessage = null;

     if (this.mode === 'teacher') {
    if (!this.classId) {
      this.errorMessage = 'Keine Klasse gefunden.';
      return;
    }
    this.exporting = true;
    this.exportService.exportUsers({ roleId: this.ROLE_STUDENT, classId: this.classId }).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, 'my_class_students_export.xlsx');
        this.exporting = false;
        this.onClose();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Export fehlgeschlagen.';
        this.exporting = false;
      },
    });
    return;
  }

    if (!this.selectedKey) {
      this.errorMessage = 'Bitte wählen Sie eine Exportoption aus.';
      return;
    }

    const selectedOption = this.options.find(o => o.key === this.selectedKey);
    if (selectedOption?.needsClass && !this.selectedClassId) {
      this.errorMessage = 'Bitte wählen Sie eine Klasse aus.';
      return;
    }

    this.exporting = true;

    let export$;

    switch (this.selectedKey) {
      case 'CLASS_WITH_STUDENTS':
        export$ = this.exportService.exportUsers({
          roleId: this.ROLE_STUDENT,
          classId: this.selectedClassId || undefined,
        });
        break;

      case 'ALL_CLASSES_WITH_STUDENTS':
        export$ = this.exportService.exportUsers({
          roleId: this.ROLE_STUDENT,
        });
        break;

      case 'ALL_STUDENTS':
        export$ = this.exportService.exportUsers({
          roleId: this.ROLE_STUDENT,
        });
        break;

      case 'ALL_TEACHERS':
        export$ = this.exportService.exportUsers({
          roleId: this.ROLE_TEACHER,
        });
        break;

      case 'ALL_ADMINS':
        export$ = this.exportService.exportUsers({
          roleId: this.ROLE_ADMIN,
        });
        break;

      case 'ALL_USERS':
        export$ = this.exportService.exportUsers();
        break;

      case 'ALL_ROLES':
        export$ = this.exportService.exportRoles();
        break;

      default:
        this.errorMessage = 'Ungültige Exportoption.';
        this.exporting = false;
        return;
    }

    export$.subscribe({
      next: (blob) => {
        const filename = this.getFileNameForSelection();
        this.triggerDownload(blob, filename);
        this.exporting = false;
        this.onClose();
      },
      error: (err) => {
        console.error('Export-Fehler', err);
        this.errorMessage = 'Export fehlgeschlagen. Bitte später erneut versuchen.';
        this.exporting = false;
      },
    });
  }

  private getFileNameForSelection(): string {
    switch (this.selectedKey) {
      case 'CLASS_WITH_STUDENTS':
        return 'class_students_export.xlsx';
      case 'ALL_CLASSES_WITH_STUDENTS':
        return 'all_classes_students_export.xlsx';
      case 'ALL_STUDENTS':
        return 'students_export.xlsx';
      case 'ALL_TEACHERS':
        return 'teachers_export.xlsx';
      case 'ALL_ADMINS':
        return 'admins_export.xlsx';
      case 'ALL_USERS':
        return 'users_export.xlsx';
      default:
        return 'export.xlsx';
    }
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
