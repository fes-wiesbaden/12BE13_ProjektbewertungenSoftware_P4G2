import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../../../Interfaces/review.interface';

@Injectable({
  providedIn: 'root',
})
export class MyAssessmentService {
  private apiUrl = 'http://localhost:4100/api';

  constructor(private http: HttpClient) {}

  postSelbstFremd(dto: Review): Observable<Review> {
      return this.http.post<Review>(`${this.apiUrl}/user/${dto.userId}/project/${dto.projectId}/review`, dto);
    }
}