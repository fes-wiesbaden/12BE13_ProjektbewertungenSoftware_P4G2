import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, AddUser, UpdateUser } from '../../../Interfaces/user.interface';
import { Class } from '../../../Interfaces/class.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:4100/api/users';
  private apiUrlClasses = 'http://localhost:4100/api/school-class';

  constructor(private http: HttpClient) {}

  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/3`);
  }

  createAdmin(dto: AddUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/role/3`, dto);
  }

  deleteAdmin(dto: User): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto.id}`);
  }

  updateAdmin(dto: UpdateUser): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${dto.id}`, dto);
  }
}