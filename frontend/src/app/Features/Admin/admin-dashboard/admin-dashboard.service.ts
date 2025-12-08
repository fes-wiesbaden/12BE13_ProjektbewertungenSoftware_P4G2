import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:4100/api/users';
  private classApiUrl = 'http://localhost:4100/api/school-class';
  constructor(private http: HttpClient) {}


  getTeacherAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/role/1/amount`);
  }

  getStudentAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/role/2/amount`);
  }

  getAdminAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/role/3/amount`);
  }

  getClassAmount(): Observable<number> {
    return this.http.get<number>(`${this.classApiUrl}/amount`);
  }
}
