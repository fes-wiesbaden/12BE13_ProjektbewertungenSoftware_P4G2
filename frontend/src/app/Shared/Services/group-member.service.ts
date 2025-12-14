import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:4100/api';

  constructor(
    private http: HttpClient,
  ) {}

  getGroupById(groupId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/${groupId}`);
  }

getMembersByGroupId(groupId: string) {
  return this.http.get<any[]>(`${this.apiUrl}/group-members/group/${groupId}/members`);
}

getAllGroupsForMember(memberId: string) {
  return this.http.get<any[]>(`${this.apiUrl}/group-members/member/${memberId}/groups`);
}

}
