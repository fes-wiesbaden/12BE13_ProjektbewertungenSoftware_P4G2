import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AddUser,
  UpdateUser,
  User,
  UserChangePassword,
  UserResetPassword,
} from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4100/api/users';

  constructor(private http: HttpClient) {}

  changePassword(username: string, dto: UserChangePassword): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${encodeURIComponent(username)}/change-password`,
      dto,
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

  resetPassword(userId: string, dto: UserResetPassword): Observable<{ temporaryPassword: string }> {
    return this.http.post<{ temporaryPassword: string }>(
      `${this.apiUrl}/${userId}/reset-password`,
      dto,
    );
  }

  getUserAmount(roleId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/role/${roleId}/amount`);
  }
}
