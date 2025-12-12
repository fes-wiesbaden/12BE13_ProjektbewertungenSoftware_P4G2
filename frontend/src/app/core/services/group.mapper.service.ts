// project-mapper.service.ts
import { Injectable } from '@angular/core';
import {IProject, ProjectCreateRequestDto, ProjectResponseDto, ProjectStatus} from '../modals/project.modal';
import {GroupCreateRequestDto, GroupResponseDto, GroupWithMembersResponseDto, IGroup} from '../modals/group.modal';

@Injectable({
  providedIn: 'root'
})
export class GroupMapperService {

  constructor() {}

  // Convert single DTO to IProject
  dtoToGroups(dto: GroupWithMembersResponseDto): IGroup {
    return {
      id: dto.id,
      name: dto.name,
      projectName: dto.projectName,
      members: dto.members
    };
  }

  createDtoToGroup(dto: GroupResponseDto): IGroup {
    return {
      id: dto.id,
      name: dto.groupName,
      projectName: dto.projectName,
      members: []
    }
  }

  // Convert array of DTOs to IProject array
  dtosToGroups(dtos: GroupWithMembersResponseDto[]): IGroup[] {
    return dtos.map(dto => this.dtoToGroups(dto));
  }

  // Convert IProject to CreateRequestDto
  // projectToCreateDto(project: Partial<IGroup>): GroupCreateRequestDto {
  //   return {
  //
  //   };
  // }

  // Map backend status to frontend status

}
