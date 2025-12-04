import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
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
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'username', label: 'Username' },
    { key: 'roleName', label: 'Role' },
  ];

  constructor(private route: ActivatedRoute, private studentService: MyStudentsService) {}

  ngOnInit(): void {
    this.classId = String(this.route.snapshot.paramMap.get('classId'));
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudent(this.classId).subscribe({
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
