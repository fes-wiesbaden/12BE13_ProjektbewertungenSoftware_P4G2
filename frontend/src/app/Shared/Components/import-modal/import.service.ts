import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private baseUrl = 'http://localhost:4100/api/import';

  constructor(private http: HttpClient) {}

  importUsers(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResult>(`${this.baseUrl}/users`, formData);
  }

  importClasses(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResult>(`${this.baseUrl}/classes`, formData);
  }
}
