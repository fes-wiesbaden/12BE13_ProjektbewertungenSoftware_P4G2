// project-mapper.service.ts
import { Injectable } from '@angular/core';
import {IProject, ProjectCreateRequestDto, ProjectResponseDto, ProjectStatus} from '../modals/project.modal';
import {GroupCreateRequestDto, GroupResponseDto, GroupWithMembersResponseDto, IGroup} from '../modals/group.modal';
import {StudentList, UserResponseDto} from '../modals/users.modal';
import {User} from '../../Shared/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupMapperService {

  constructor() {}

  // Convert single DTO to IProject
  dtoWithMembersToGroups(dto: GroupWithMembersResponseDto): IGroup {
    return {
      id: dto.id,
      name: dto.name,
      projectName: dto.projectName,
      projectId: dto.projectId,
      members: dto.members,
      memberCount: dto.memberCount,
    };
  }

  dtoToGroup(dto: GroupResponseDto): IGroup {
    return {
      id: dto.id,
      name: dto.groupName,
      projectName: dto.projectName,
      projectId: dto.projectId,
      members: [],
      memberCount: 0,
    }
  }

  createDtoToGroup(dto: GroupResponseDto): IGroup {
    return {
      id: dto.id,
      name: dto.groupName,
      projectId: dto.projectId,
      projectName: dto.projectName,
      members: [],
      memberCount: 0,
    }
  }

  // Convert array of DTOs to IProject array
  dtosWithMembersToGroups(dtos: GroupWithMembersResponseDto[]): IGroup[] {
    return dtos.map(dto => this.dtoWithMembersToGroups(dto));
  }

  dtosToGroups(dtos: GroupResponseDto[]): IGroup[] {
    return dtos.map(dto => this.dtoToGroup(dto));
  }

  // server all users dto to client students list dto
  userResponseDtoToStudent(dto: User): StudentList{
    return {
      id: dto.id,
      fullName: `${dto.firstName} ${dto.lastName}`,
      username: dto.username,
      courseId: dto.courseId

    }
  }

  userResponseDtoToStudentList(dtos: User[]): StudentList[]{
    return dtos.map(dto => this.userResponseDtoToStudent(dto));
  }

}
