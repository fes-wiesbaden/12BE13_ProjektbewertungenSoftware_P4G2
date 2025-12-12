import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddCourse, Course } from '../models/course.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:4100/api/school-class';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/all`);
  }

  createCourse(dto: AddCourse): Observable<Course> {
  return this.http.post<Course>(`${this.apiUrl}`, dto);
}

  updateCourse(dto: { id: string; name: string }): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${dto.id}`, dto);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCoursesByUser(): Observable<Course[]> {
    const token = this.authService.getToken();

    return this.http.get<Course[]>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAvailableCourses(): Observable<Course[]> {
    const token = this.authService.getToken();

    return this.http.get<Course[]>(`${this.apiUrl}/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getCourseAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/amount`);
  }
}
