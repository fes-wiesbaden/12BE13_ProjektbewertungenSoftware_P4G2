import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponents } from '../../../Shared/Components/page-header/page-header';
import { TableColumn, TableColumnComponent } from '../../../Shared/Components/table-column/table-column';
import { User } from '../../../Interfaces/user.interface';
import { MyStudentsService } from './my-students.service';

@Component({
  selector: 'app-my-students',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PageHeaderComponents,
    TableColumnComponent,
  ],
  templateUrl: './my-students.html',
})
export class MyStudents implements OnInit {
  classId!: string;
  students: User[] = [];
  loading = true;

  columns: TableColumn<User>[] = [
    { key: 'firstName', label: 'Vorname' },
    { key: 'lastName', label: 'Nachname' },
    { key: 'username', label: 'Benutzername' },
    { key: 'roleName', label: 'Rolle' },
  ];

  constructor(private route: ActivatedRoute, private studentService: MyStudentsService, private router: Router) {}

  openStudentDetail(item: any) {
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
