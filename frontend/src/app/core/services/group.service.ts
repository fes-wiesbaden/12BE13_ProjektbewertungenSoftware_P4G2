import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {GroupCreateRequestDto, GroupResponseDto, GroupWithMembersResponseDto, IGroup} from '../modals/group.modal';
import {GroupMapperService} from './group.mapper.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupApi = 'http://localhost:4100/api/groups';
  private groupMembersApi = 'http://localhost:4100/api/group-members';

  constructor(private http: HttpClient, private mapper: GroupMapperService) {}

  createGroup(group: GroupCreateRequestDto): Observable<IGroup> {
    return this.http.post<GroupWithMembersResponseDto>(`${this.groupApi}`, group)
      .pipe(
        map(dto => this.mapper.dtoToGroups(dto))
      );
  }

  getGroupById(projectId: string): Observable<IGroup> {
    return this.http.get<GroupWithMembersResponseDto>(`${this.groupApi}/${projectId}`)
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
