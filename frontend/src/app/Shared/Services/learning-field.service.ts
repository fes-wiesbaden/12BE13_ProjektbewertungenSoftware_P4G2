import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddLearningfield, LearningField } from '../models/learning-fields.interface';
import { Observable } from 'rxjs/internal/Observable';
import { Grade } from '../../Interfaces/grade.interface';

@Injectable({
  providedIn: 'root',
})
export class LearningFieldService {
  private apiUrl = 'http://localhost:4100/api';

  constructor(private http: HttpClient) {}

  getAllLearningFields(): Observable<LearningField[]> {
    return this.http.get<LearningField[]>(`${this.apiUrl}/training-modules`);
  }

  createLearningField(dto: AddLearningfield): Observable<LearningField> {
    return this.http.post<LearningField>(`${this.apiUrl}/training-modules`, dto);
  }

  deleteLearnField(dto: LearningField): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/training-modules/${dto.id}`);
  }

  updateLearningField(dto: LearningField): Observable<LearningField> {
    return this.http.put<LearningField>(`${this.apiUrl}/training-modules/${dto.id}`, dto);
  }

  getAllLearningFieldsByUserId(user: string): Observable<LearningField[]> {
    return this.http.get<LearningField[]>(`${this.apiUrl}/user/${user}/training-modules`);
  }

  getGradeByUserId(userId: string, trainingModulesId: string): Observable<Grade[]> {
    return this.http.get<Grade[]>(
      `${this.apiUrl}/user/${userId}/training-modules/${trainingModulesId}/grades`,
    );
  }
}
