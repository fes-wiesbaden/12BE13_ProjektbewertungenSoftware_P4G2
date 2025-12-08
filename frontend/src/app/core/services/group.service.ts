// src/app/services/group.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  AddMemberToGroupDto,
  UserProjectGroupResponse
} from '../../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:4100/api/groups';

  constructor(private http: HttpClient) {}

  /**
   * Create a new group
   */
  createGroup(groupData: CreateGroupDto): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, groupData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all groups
   */
  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get group by ID
   */
  getGroupById(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${groupId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update group
   */
  updateGroup(groupId: string, updateData: UpdateGroupDto): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${groupId}`, updateData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete group
   */
  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add member to group
   */
  addMemberToGroup(memberData: AddMemberToGroupDto): Observable<UserProjectGroupResponse> {
    return this.http.post<UserProjectGroupResponse>(`${this.apiUrl}/members`, memberData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all members in a group
   */
  getGroupMembers(groupId: string): Observable<UserProjectGroupResponse[]> {
    return this.http.get<UserProjectGroupResponse[]>(`${this.apiUrl}/${groupId}/members`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
