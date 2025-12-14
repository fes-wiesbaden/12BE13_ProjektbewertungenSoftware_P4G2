import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:4100/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}


  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  getGroupById(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/${groupId}`);
  }

getMembersByGroupId(groupId: string) {
  return this.http.get<any[]>(`${this.apiUrl}/group-members/group/${groupId}/members`);
}

getAllGroupsForMember(memberId: string) {
  return this.http.get<any[]>(`${this.apiUrl}/group-members/member/${memberId}/groups`);
}

// Get groups by project ID
  getGroupsByProjectId(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/projects/${projectId}/groups`,
      { headers: this.getHeaders() }
    );
  }

}
