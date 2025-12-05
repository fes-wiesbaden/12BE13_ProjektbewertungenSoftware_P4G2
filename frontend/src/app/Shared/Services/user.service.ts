import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4100/api/users';

  constructor(private http: HttpClient) {}


  changePassword(dto: ChangePasswordRequest): Observable<void> {

    return this.http.post<void>(`${this.apiUrl}/change-password`, dto);
  }

}
