// my-assessment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import {AssessmentSubmissionDto} from '../models/assessment.modal';

@Injectable({
  providedIn: 'root'
})
export class MyAssessmentService {
  private apiUrl = 'http://localhost:4100/api/assessments';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (!token) {
      console.error('❌ No authentication token found!');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // FIX: Make sure this returns Observable
  submitAssessment(assessmentData: AssessmentSubmissionDto): Observable<any> {
    console.log('📤 Submitting assessment to:', this.apiUrl);
    console.log('📤 Assessment data:', JSON.stringify(assessmentData));

    // IMPORTANT: Add 'return' here!
    return this.http.post(this.apiUrl, assessmentData, {
      headers: this.getHeaders()
    });
  }

  checkIfAlreadySubmitted(reviewerId: string, groupId: string): Observable<boolean> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<boolean>(
      `${this.apiUrl}/check-submission/${reviewerId}/${groupId}`,
      { headers }
    );
  }

  getReviewsByReviewer(reviewerId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/reviewer/${reviewerId}`, { headers });
  }

  getReviewsByGroup(groupId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/group/${groupId}`, { headers });
  }

  getGroupStatistics(groupId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/group/${groupId}/statistics`, { headers });
  }
}
