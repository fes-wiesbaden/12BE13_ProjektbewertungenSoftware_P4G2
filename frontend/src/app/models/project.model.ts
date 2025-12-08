import {Group} from './group.model';

export interface Project {
  id: string;
  projectName: string;
  projectDescription: string;
  status: string;
  deadline: Date;
  groups: Group[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
  deadline: Date;
  status: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface ProjectDtoResponse {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: string;
}

export interface GroupDtoResponse {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
}


export interface IProject {
  id: string;
  name: string;
  description: string;
  deadline: Date;
  status: string;
  trainingModule: [];
  reviews: [];
  groups: Group[];
}
