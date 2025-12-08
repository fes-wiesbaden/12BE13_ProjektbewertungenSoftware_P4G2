// src/app/services/project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  IProject,
  CreateProjectDto,
  UpdateProjectDto,
  GroupDtoResponse,
  ProjectDtoResponse, Project
} from '../../models/project.model';
import { Group } from '../../models/group.model';
// import { IProject } from '../../Interfaces/IProject';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:4100/api/projects';

  constructor(private http: HttpClient) {}

  createNewProject(project: CreateProjectDto): Observable<IProject> {
    return this.http.post<IProject>(`${this.apiUrl}`, project);
  }

  getProjectById(projectId: string): Observable<IProject>{
    return this.http.get<IProject>(`${this.apiUrl}/${projectId}`);
  }

  getAllProjects(): Observable<IProject[]> {
    return this.http.get<IProject[]>(`${this.apiUrl}`);
  }



    getProjectByIdWithGroups(projectId: string): Observable<Project> {
      return this.http.get<ProjectDtoResponse>(`${this.apiUrl}/${projectId}`).pipe(
        map(dto => {
          const project = this.mapProjectDtoToProject(dto, []);
          // load groups
          this.getProjectGroups(projectId).subscribe(groups => {
            project.groups = groups;
          });
            return project;
        }),
        catchError(this.handleError)
      );
    }


  getProjectGroups(projectId: string): Observable<Group[]> {
    return this.http.get<GroupDtoResponse[]>(`${this.apiUrl}/${projectId}/groups`).pipe(
      map(dtos => dtos.map(dto => this.mapGroupDtoToGroup(dto))),
      catchError(this.handleError)
    );
  }

  private mapProjectDtoToProject(dto: ProjectDtoResponse, groups: Group[]): Project {
    return {
      id: dto.id,
      projectName: dto.name,
      projectDescription: dto.description,
      status: dto.status,
      deadline: new Date(dto.deadline),
      groups: groups
    };
  }

  private mapGroupDtoToGroup(dto: GroupDtoResponse): Group {
    return {
      id: dto.id,
      name: dto.name,
      projectId: dto.projectId,
    };
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // /**
  //  * Create a new project
  //  */
  // createProject(project: CreateProjectDto): Observable<Project> {
  //   return this.http.post<Project>(this.apiUrl, project).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  //
  // /**
  //  * Get all projects
  //  */
  // getAllProjects(): Observable<Project[]> {
  //   return this.http.get<Project[]>(this.apiUrl).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  //
  // /**
  //  * Get project by ID
  //  */
  // getProjectById(projectId: string): Observable<Project> {
  //   return this.http.get<IProject>(`${this.apiUrl}/${projectId}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  //
  // /**
  //  * Update project
  //  */
  // updateProject(projectId: string, updateData: UpdateProjectDto): Observable<Project> {
  //   return this.http.put<Project>(`${this.apiUrl}/${projectId}`, updateData).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  //
  // /**
  //  * Delete project
  //  */
  // deleteProject(projectId: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${projectId}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  //
  // /**
  //  * Get all groups in a project
  //  */
  // getProjectGroups(projectId: string): Observable<Group[]> {
  //   return this.http.get<Group[]>(`${this.apiUrl}/${projectId}/groups`).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  //
  // /**
  //  * Error handler
  //  */
  // private handleError(error: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occurred!';
  //
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side error
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // Server-side error
  //     if (error.error && error.error.message) {
  //       errorMessage = error.error.message;
  //     } else {
  //       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //     }
  //   }
  //
  //   console.error(errorMessage);
  //   return throwError(() => new Error(errorMessage));
  // }
}
