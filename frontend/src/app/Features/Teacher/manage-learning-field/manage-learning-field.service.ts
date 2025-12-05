import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningField } from '../../../Interfaces/learning-field.interface';

@Injectable({
  providedIn: 'root',
})
export class ManageLearningFieldService {
  private apiUrl = 'http://localhost:4100/api';

  constructor(private http: HttpClient) {}

  getLearningField(studentId: string): Observable<LearningField[]> {
    return this.http.get<LearningField[]>(`${this.apiUrl}/user/${studentId}/training-modules`);
  }
}