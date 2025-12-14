import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import {
  GroupAssessmentStatisticsDto,
  ReviewResponseDto
} from '../models/assessment-results.interface';
import {ProjectWithGroupsResponseDto} from '../../core/modals/project.modal';

@Injectable({
  providedIn: 'root'
})
export class AssessmentResultsService {
  private baseUrl = 'http://localhost:4100/api';
  private apiUrl = 'http://localhost:4100/api/assessments';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProjectsWithGroups(): Observable<ProjectWithGroupsResponseDto[]> {
    return this.http.get<ProjectWithGroupsResponseDto[]>(`${this.baseUrl}/projects/groups`);
  }


  getReviewsByGroup(groupId: string): Observable<ReviewResponseDto[]> {
    return this.http.get<ReviewResponseDto[]>(`${this.baseUrl}/assessments/group/${groupId}`);
  }
}
