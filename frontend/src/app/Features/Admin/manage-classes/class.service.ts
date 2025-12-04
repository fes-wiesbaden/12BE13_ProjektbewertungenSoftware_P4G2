import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddClass, Class } from '../../../Interfaces/class.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = 'http://localhost:4100/api/school-class';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiUrl}/all`);
  }

  createClass(dto: AddClass): Observable<Class> {
    return this.http.post<Class>(this.apiUrl, dto);
  }

  updateClass(dto: { id: string; name: string }): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/${dto.id}`, dto);
  }

  // optional für später:
  deleteClass(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
