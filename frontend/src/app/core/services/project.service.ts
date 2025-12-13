import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IProject,
  ProjectCreateRequestDto,
  ProjectNamesResponseDto,
  ProjectResponseDto,
  ProjectWithGroupsResponseDto
} from '../modals/project.modal';
import {map, Observable} from 'rxjs';
import {ProjectMapperService} from './project.mapper.service';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsApi = 'http://localhost:4100/api/projects';



  constructor(private http: HttpClient,
              private mapper: ProjectMapperService,
              private authService: AuthService
  ) {}

  createProject(project: ProjectCreateRequestDto): Observable<IProject> {
    const token = this.authService.getToken();

    return this.http.post<ProjectResponseDto>(`${this.projectsApi}`, project, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .pipe(
        map(dto => this.mapper.dtoToProject(dto))
      );
  }

  getProjectById(projectId: string): Observable<IProject> {
    return this.http.get<ProjectResponseDto>(`${this.projectsApi}/${projectId}`)
      .pipe(
        map(dto => this.mapper.dtoToProject(dto))
      );
  }

  getProjectWithGroupsById(projectId: string): Observable<IProject> {
    return this.http.get<ProjectWithGroupsResponseDto>(`${this.projectsApi}/${projectId}/groups`)
      .pipe(
        map(dto => this.mapper.dtoToProjectWithGroup(dto))
      );
  }

  getAllProjects(): Observable<IProject[]> {
    return this.http.get<ProjectResponseDto[]>(`${this.projectsApi}`)
      .pipe(
        map(dtos => this.mapper.dtosToProjects(dtos))
      );
  }

  getAllProjectsWithGroups(): Observable<IProject[]> {
    return this.http.get<ProjectWithGroupsResponseDto[]>(`${this.projectsApi}/groups`)
    .pipe(
      map(dtos => this.mapper.dtosToProjectsWithGroups(dtos))
    )
  }

  getAllProjectsNames() : Observable<ProjectNamesResponseDto[]>{
    return this.http.get<ProjectNamesResponseDto[]>(`${this.projectsApi}/names`);
  }
}
