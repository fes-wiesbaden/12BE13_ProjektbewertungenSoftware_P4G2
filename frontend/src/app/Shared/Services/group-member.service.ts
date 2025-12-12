import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:4100/api/';

  constructor(
    private http: HttpClient,
  ) {}

getMembersByGroupId(groupId: string) {
  return this.http.get<any[]>(`${this.apiUrl}group-members/group/${groupId}/members`);
}

getAllGroupsForMember(memberId: string) {
  return this.http.get<any[]>(`${this.apiUrl}group-members/member/${memberId}/groups`);
}

}
