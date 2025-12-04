import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../Interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class MyStudentsService {
  private apiUrl = 'http://localhost:4100/api/users';

  constructor(private http: HttpClient) {}

  getStudent(classId: string): Observable<User[]> {
    console.log(classId);
    return this.http.get<User[]>(`${this.apiUrl}/role/2/class/${classId}`);
  }
}
