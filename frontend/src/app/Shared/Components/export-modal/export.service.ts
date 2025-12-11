import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private baseUrl = 'http://localhost:4100/api/export';

  constructor(private http: HttpClient) {}

  exportUsers(options?: { roleId?: number; classId?: string }): Observable<Blob> {
    let params = new HttpParams();
    if (options?.roleId != null) {
      params = params.set('roleId', options.roleId);
    }
    if (options?.classId != null) {
      params = params.set('classId', options.classId);
    }

    return this.http.get(`${this.baseUrl}/users`, {
      params,
      responseType: 'blob',
    });
  }

  exportClasses(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/classes`, {
      responseType: 'blob',
    });
  }

  exportRoles(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/roles`, {
      responseType: 'blob',
    });
  }
}
