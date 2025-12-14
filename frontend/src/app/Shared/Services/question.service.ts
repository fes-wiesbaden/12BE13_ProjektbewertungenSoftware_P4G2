import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddQuestionDto, QuestionResponseDto } from '../models/question.interface';
import { Observable } from 'rxjs';
import {AuthService} from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:4100/api/questions';

  constructor(private http: HttpClient, private authService : AuthService) { }



  getAllQuestions(): Observable<QuestionResponseDto[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log(headers);

    return this.http.get<QuestionResponseDto[]>(this.apiUrl, {headers: headers});
  }

  getAllQuestionsByProjectId(projectId: string): Observable<QuestionResponseDto[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log(headers);

    return this.http.get<QuestionResponseDto[]>(`${this.apiUrl}/project/${projectId}`, {headers: headers});
  }

  // Get group details (includes project info)
  getGroupById(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/${groupId}`);
  }

  createQuestion(dto: AddQuestionDto): Observable<QuestionResponseDto> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<QuestionResponseDto>(this.apiUrl, dto, {headers: headers});

  }

  updateQuestion(dto: QuestionResponseDto): Observable<QuestionResponseDto> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<QuestionResponseDto>(`${this.apiUrl}/${dto.id}`, dto, {headers: headers});

  }

  deleteQuestion(id: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers: headers});

  }
}
