// project-mapper.service.ts
import { Injectable } from '@angular/core';
import {IProject, ProjectCreateRequestDto, ProjectResponseDto, ProjectStatus} from '../modals/project.modal';

@Injectable({
  providedIn: 'root'
})
export class ProjectMapperService {

  constructor() {}

  // Convert single DTO to IProject
  dtoToProject(dto: ProjectResponseDto): IProject {
    return {
      id: dto.id,
      title: dto.projectName,
      description: dto.projectDescription,
      status: this.mapProjectStatus(dto.ProjectStatus),
      startDate: new Date(dto.startDate),
      dueDate: new Date(dto.dueDate),
      groups: [], // Initialize empty or fetch separately
    };
  }

  // Convert array of DTOs to IProject array
  dtosToProjects(dtos: ProjectResponseDto[]): IProject[] {
    return dtos.map(dto => this.dtoToProject(dto));
  }

  // Convert IProject to CreateRequestDto
  projectToCreateDto(project: Partial<IProject>): ProjectCreateRequestDto {
    return {
      projectName: project.title || '',
      projectDescription: project.description || '',
      startDate: this.toLocalDateTime(project.startDate || new Date()),
      dueDate: this.toLocalDateTime(project.dueDate || new Date()),
      ProjectStatus: this.mapToProjectStatus(project.status)
    };
  }

// Helper method in the same mapper service
  private toLocalDateTime(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toISOString().slice(0, -1);
  }

  // Map backend status to frontend status
  private mapProjectStatus(backendStatus: ProjectStatus): IProject['status'] {
    switch (backendStatus) {
      case ProjectStatus.PENDING:
        return 'pending';
      case ProjectStatus.IN_PROGRESS:
        return 'active';
      case ProjectStatus.COMPLETED:
        return 'completed';
      case ProjectStatus.CANCELLED:
        return 'cancelled';
      case ProjectStatus.ON_HOLD:
        return 'on-hold';
      default:
        return 'pending';
    }
  }

  // Map frontend status to backend status
  private mapToProjectStatus(frontendStatus?: string): ProjectStatus {
    switch (frontendStatus) {
      case 'pending':
        return ProjectStatus.PENDING;
      case 'in progress':
        return ProjectStatus.IN_PROGRESS;
      case 'completed':
        return ProjectStatus.COMPLETED;
      case 'cancelled':
        return ProjectStatus.CANCELLED;
      case 'on hold':
        return ProjectStatus.ON_HOLD;
      default:
        return ProjectStatus.PENDING;
    }
  }

  // Helper method to get human-readable status label
  getStatusLabel(status?: IProject['status']): string {
    const labels: Record<string, string> = {
      'pending': 'Pending',
      'active': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'on-hold': 'On Hold'
    };
    return labels[status || 'pending'];
  }
}
