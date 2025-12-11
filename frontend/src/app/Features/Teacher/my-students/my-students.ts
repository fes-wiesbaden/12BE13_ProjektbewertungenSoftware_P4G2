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

@Component({
  selector: 'app-my-students',
  imports: [CommonModule, FormsModule, MatIconModule, PageHeaderComponents, TableColumnComponent],
  templateUrl: './my-students.html',
})
export class MyStudents implements OnInit {
  courseId!: string;
  courseName!: string;
  students: User[] = [];
  loading = true;

  columns: TableColumn<User>[] = [
    { key: 'firstName', label: 'Vorname' },
    { key: 'lastName', label: 'Nachname' },
    { key: 'username', label: 'Benutzername' },
    { key: 'courseName', label: 'Kurs' },
  ];

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
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const courseNameParam = this.route.snapshot.paramMap.get('courseName');
    if (!courseIdParam) {
      console.error("Missing or invalid 'courseId' route parameter.");
      this.loading = false;
      return;
    }
    if (!courseNameParam) {
      console.error("Missing or invalid 'courseName' route parameter.");
      this.loading = false;
      return;
    }
    this.courseId = courseIdParam;
    this.courseName = courseNameParam;
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents(this.courseId).subscribe({
      next: (data) => {
        this.students = data.map(s => ({
        ...s,
        courseName: [this.courseName]
      }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Schüler', err);
        this.loading = false;
      },
    });
  }
}
