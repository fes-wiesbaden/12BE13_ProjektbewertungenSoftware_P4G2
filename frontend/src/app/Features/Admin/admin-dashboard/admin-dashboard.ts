import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  studentAmount = 0;
  teacherAmount = 0;
  adminAmount = 0;
  classAmount = 0;

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardAmounts();
  }

  loadDashboardAmounts() {
    this.dashboardService.getTeacherAmount().subscribe({
      next: (value) => this.teacherAmount = value,
      error: (err) => console.error('Fehler beim Laden der Lehreranzahl', err),
    });

    this.dashboardService.getStudentAmount().subscribe({
      next: (value) => this.studentAmount = value,
      error: (err) => console.error('Fehler beim Laden der Schüleranzahl', err),
    });
    this.dashboardService.getAdminAmount().subscribe({
      next: (value) => this.adminAmount = value,
      error: (err) => console.error('Fehler beim Laden der Adminanzahl', err),
    });
    this.dashboardService.getClassAmount().subscribe({
    next: (value) => (this.classAmount = value),
    error: (err) => console.error('Fehler beim Laden der Klassenanzahl', err),
   });
  }
}
