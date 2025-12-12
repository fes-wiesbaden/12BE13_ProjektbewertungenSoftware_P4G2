export enum ProjectStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  CANCELLED,
  ON_HOLD
}

export interface ProjectCreateRequestDto {
  projectName: string;
  projectDescription: string;
  startDate: Date;
  dueDate: Date;
  ProjectStatus: ProjectStatus;
}

export interface ProjectResponseDto {
  id: string;
  projectName: string;
  projectDescription: string;
  startDate: Date;
  dueDate: Date;
  ProjectStatus: ProjectStatus;
  groupCount: number;
}



// frontend
// project.modal.ts

export interface IProject {
  id: string;
  title: string;
  description?: string;
  status?: 'active' | 'completed' | 'pending' | 'overdue' | 'on-hold' | 'cancelled';
  startDate: Date;
  dueDate: Date;
  groups: IGroup[];
}

export interface IGroup {
  id: string;
  name: string;
  members: string[];
}
