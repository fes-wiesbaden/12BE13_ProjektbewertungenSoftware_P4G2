import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddUser, UpdateUser, User } from '../models/user.interface';

export interface ChangePasswordRequestDto {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4100/api/user';

  constructor(private http: HttpClient) {}

  changePassword(username: string, dto: ChangePasswordRequestDto): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${encodeURIComponent(username)}/change-password`,
      dto
    );
  }

  getUsersByRoleId(roleId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${roleId}`);
  }

  createUserByRoleId(roleId: number, dto: AddUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/role/${roleId}`, dto);
  }

  deleteUser(dto: User): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto.id}`);
  }

  updateUser(dto: UpdateUser): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${dto.id}`, dto);
  }

  resetPassword(userId: string): Observable<{ temporaryPassword: string }> {
    return this.http.post<{ temporaryPassword: string }>(`${this.apiUrl}/${userId}/reset-password`, null);
  }
}