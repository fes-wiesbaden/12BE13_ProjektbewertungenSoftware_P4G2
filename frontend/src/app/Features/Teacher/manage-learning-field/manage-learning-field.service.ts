import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningField } from '../../../Interfaces/learning-field.interface';
import { AddGrade, Grade } from '../../../Interfaces/grade.interface';

@Injectable({
  providedIn: 'root',
})
export class ManageLearningFieldService {
  private apiUrl = 'http://localhost:4100/api';

  constructor(private http: HttpClient) {}

  getLearningField(studentId: string): Observable<LearningField[]> {
    return this.http.get<LearningField[]>(`${this.apiUrl}/user/${studentId}/training-modules`);
  }

  getGrades(learningFieldId: string, studentId: string): Observable<Grade[]> {
    return this.http.get<Grade[]>(
      `${this.apiUrl}/user/${studentId}/training-modules/${learningFieldId}/grades`
    );
  }

  addGrade(studentId: string, learningFieldId: string, grade: AddGrade): Observable<Grade> {
    return this.http.post<Grade>(
      `${this.apiUrl}/user/${studentId}/training-modules/${learningFieldId}/grade`,
      grade,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  updateGrade(studentId: string, learningFieldId: string, gradeId: string, grade: Grade) {
  return this.http.put(`${this.apiUrl}/user/${studentId}/training-modules/${learningFieldId}/grade/${gradeId}`, grade);
}

deleteGrade(studentId: string, learningFieldId: string, gradeId: string) {
  return this.http.delete(`${this.apiUrl}/user/${studentId}/training-modules/${learningFieldId}/grade/${gradeId}`);
}
}
