import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import {
  TableColumn,
  TableColumnComponent,
} from '../../../Shared/Components/table-column/table-column';
import { MyStudentsService } from './my-students.service';
import { User } from '../../../Shared/models/user.interface';
import { ImportModalComponent } from '../../../Shared/Components/import-modal/import-modal';
import { ExportModalComponent } from '../../../Shared/Components/export-modal/export-modal';

@Component({
  selector: 'app-my-students',
  imports: [CommonModule, FormsModule, MatIconModule, PageHeaderComponents, TableColumnComponent,ExportModalComponent, ImportModalComponent],
  templateUrl: './my-students.html',
})
export class MyStudents implements OnInit {
  classId!: string;
  students: User[] = [];
  loading = true;
  showImportModal = false;
  showExportModal = false;
  columns: TableColumn<User>[] = [
    { key: 'firstName', label: 'Vorname' },
    { key: 'lastName', label: 'Nachname' },
    { key: 'username', label: 'Benutzername' },
    { key: 'roleName', label: 'Rolle' },
  ];
  onImportFile(file: File) {
    console.log('Import-Datei:', file);
  }
  constructor(
    private route: ActivatedRoute,
    private studentService: MyStudentsService,
    private router: Router,
  ) {}

  openStudentDetail(item: User) {
    const studentId = item.id;
    this.router.navigate(['/teacher/manage-learning-fields', studentId]);
  }

  ngOnInit(): void {
    const classIdParam = this.route.snapshot.paramMap.get('classId');
    if (!classIdParam) {
      console.error("Missing or invalid 'classId' route parameter.");
      this.loading = false;
      return;
    }
    this.classId = classIdParam;
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents(this.classId).subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Schüler', err);
        this.loading = false;
      },
    });
  }
}
