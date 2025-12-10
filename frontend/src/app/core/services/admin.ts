import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ResetPasswordResponseDto {
  temporaryPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:4100/api/users';

  constructor(private http: HttpClient) {}

  resetPassword(userId: string): Observable<ResetPasswordResponseDto> {
    return this.http.post<ResetPasswordResponseDto>(
      `${this.apiUrl}/${userId}/reset-password`,
      {}
    );
  }
}
