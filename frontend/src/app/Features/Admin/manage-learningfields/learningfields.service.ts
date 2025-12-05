import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddLearningfields, LearningField } from '../../../Interfaces/learningfields.interface';

@Injectable({
  providedIn: 'root',
})
export class learningfieldService {
  private apiUrl = 'http://localhost:4100/api/training-modules';

  constructor(private http: HttpClient) {}

  getLearningfields(): Observable<LearningField[]> {
    return this.http.get<LearningField[]>(this.apiUrl);
  }

  createLearningfields(dto: AddLearningfields): Observable<LearningField> {
    return this.http.post<LearningField>(this.apiUrl, dto);
  }

  updateLearningfields(dto: LearningField): Observable<LearningField> {
    return this.http.put<LearningField>(`${this.apiUrl}/${dto.id}`, dto);
  }
}