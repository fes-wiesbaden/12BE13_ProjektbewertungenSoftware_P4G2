import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {GroupCreateRequestDto, GroupResponseDto, GroupWithMembersResponseDto, IGroup} from '../modals/group.modal';
import {GroupMapperService} from './group.mapper.service';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupApi = 'http://localhost:4100/api/groups';
  private groupMembersApi = 'http://localhost:4100/api/group-members';

  constructor(
    private http: HttpClient,
    private mapper: GroupMapperService,
    private authService: AuthService
  ) {}

  createGroup(group: GroupCreateRequestDto): Observable<IGroup> {
    const token = this.authService.getToken();
    console.log('Token:', token);
    console.log('Group API URL:', this.groupApi);
    console.log('Request Body:', group);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // ✅ FIXED: Added parentheses around template literal
    return this.http.post<GroupResponseDto>(`${this.groupApi}`, group, { headers })
      .pipe(
        map(dto => this.mapper.createDtoToGroup(dto))
      );
  }

  getGroupById(projectId: string): Observable<IGroup> {
    // ✅ FIXED: Added parentheses around template literal
    return this.http.get<GroupWithMembersResponseDto>(`${this.groupMembersApi}/group/${projectId}/details`)
      .pipe(
        map(dto => this.mapper.dtoToGroups(dto))
      );
  }

  getAllGroupsWithMembers(): Observable<IGroup[]> {
    return this.http.get<GroupWithMembersResponseDto[]>(`${this.groupMembersApi}/group/details`)
      .pipe(
        map(dtos => this.mapper.dtosToGroups(dtos))
      );
  }
}
