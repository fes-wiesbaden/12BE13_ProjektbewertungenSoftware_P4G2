import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Shared/Services/user.service';
import { CourseService } from '../../../Shared/Services/course.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
  ],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  studentAmount = 0;
  teacherAmount = 0;
  adminAmount = 0;
  classAmount = 0;
  loading = true;

  constructor(
    private courseService: CourseService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardAmounts();
  }

  loadDashboardAmounts() {
    this.loading = true;
    forkJoin({
      teachers: this.userService.getUserAmount(1),
      students: this.userService.getUserAmount(2),
      admins: this.userService.getUserAmount(3),
      classes: this.courseService.getCourseAmount(),
    }).subscribe({
      next: (result) => {
        this.teacherAmount = result.teachers;
        this.studentAmount = result.students;
        this.adminAmount = result.admins;
        this.classAmount = result.classes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Dashboard-Daten', err);
        this.loading = false;
      },
    });
  }
}
