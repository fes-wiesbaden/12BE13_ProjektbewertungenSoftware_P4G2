import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddLearningfield, LearningField } from '../models/learning-fields.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class LearningFieldService {
  private apiUrl = 'http://localhost:4100/api/training-modules';

  constructor(private http: HttpClient) {}

  getAllLearningFields(): Observable<LearningField[]> {
    return this.http.get<LearningField[]>(this.apiUrl);
  }

  createLearningField(dto: AddLearningfield): Observable<LearningField> {
    return this.http.post<LearningField>(this.apiUrl, dto);
  }

  deleteLearnField(dto: LearningField): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto.id}`);
  }

  updateLearningField(dto: LearningField): Observable<LearningField> {
    return this.http.put<LearningField>(`${this.apiUrl}/${dto.id}`, dto);
  }
}
