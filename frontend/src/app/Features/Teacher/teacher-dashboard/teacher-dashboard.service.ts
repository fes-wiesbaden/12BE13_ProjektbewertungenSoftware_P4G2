import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Class, ConnectClass } from '../../../Interfaces/class.interface';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TeacherDashboardService {
  private apiUrl = 'http://localhost:4100/api/school-class';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMyClasses(): Observable<Class[]> {
    const token = this.authService.getToken();

    return this.http.get<Class[]>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getClasses(): Observable<Class[]> {
    const token = this.authService.getToken();

    return this.http.get<Class[]>(`${this.apiUrl}/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // optional für später:
  deleteClass(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  connectClass(dto: ConnectClass): Observable<void> {
    const token = this.authService.getToken();
    const url = `${this.apiUrl}/${dto.id}/user`;
    return this.http.post<void>(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
