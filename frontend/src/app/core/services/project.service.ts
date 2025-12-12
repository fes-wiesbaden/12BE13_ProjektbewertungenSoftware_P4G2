import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IProject, ProjectCreateRequestDto, ProjectResponseDto} from '../modals/project.modal';
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

    const payload = {
      ...project,
      startDate: new Date(project.startDate).toISOString().slice(0, -1),
      dueDate: new Date(project.dueDate).toISOString().slice(0, -1),
    }

    return this.http.post<ProjectResponseDto>(`${this.projectsApi}`, payload, {
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

  getAllProjects(): Observable<IProject[]> {
    return this.http.get<ProjectResponseDto[]>(`${this.projectsApi}`)
      .pipe(
        map(dtos => this.mapper.dtosToProjects(dtos))
      );
  }
}
