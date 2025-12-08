import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, AddUser, UpdateUser } from '../../../Interfaces/user.interface';
import { Class } from '../../../Interfaces/class.interface';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'http://localhost:4100/api/users';
  private apiUrlClasses = 'http://localhost:4100/api/school-class';

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/1`);
  }

  createTeacher(dto: AddUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/role/1`, dto);
  }

  deleteTeacher(dto: User): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto.id}`);
  }

  updateTeacher(dto: UpdateUser): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${dto.id}`, dto);
  }

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiUrlClasses}/all`);
  }
}
