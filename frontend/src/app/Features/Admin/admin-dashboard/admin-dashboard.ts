import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Shared/Services/user.service';
import { CourseService } from '../../../Shared/Services/course.service';

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

  constructor(private courseService: CourseService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadDashboardAmounts();
  }

  loadDashboardAmounts() {
    this.loading = true;
    this.userService.getUserAmount(1).subscribe({
      next: (value) => (this.teacherAmount = value),
      error: (err) => console.error('Fehler beim Laden der Lehreranzahl', err),
    });

    this.userService.getUserAmount(2).subscribe({
      next: (value) => (this.studentAmount = value),
      error: (err) => console.error('Fehler beim Laden der Schüleranzahl', err),
    });

    this.userService.getUserAmount(3).subscribe({
      next: (value) => (this.adminAmount = value),
      error: (err) => console.error('Fehler beim Laden der Adminanzahl', err),
    });

    this.courseService.getCourseAmount().subscribe({
      next: (value) => (this.classAmount = value),
      error: (err) => console.error('Fehler beim Laden der Klassenanzahl', err),
    });
  }
}
