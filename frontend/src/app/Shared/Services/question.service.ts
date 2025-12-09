import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddQuestion, Question } from '../models/question.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:4100/api/question';

  constructor(private http: HttpClient) {}

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  createQuestion(dto: AddQuestion): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, dto);
  }

  updateQuestion(dto: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${dto.id}`, dto);
  }
}
