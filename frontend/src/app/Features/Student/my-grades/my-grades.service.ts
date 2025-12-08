import { Injectable } from "@angular/core";
import { LearningField } from "../../../Interfaces/learningfields.interface";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})

export class MyGradesService {
    private apiUrl = 'http://localhost:4100/api';
    
    constructor(private http: HttpClient) {}

    getLearningField(studentId: string): Observable<LearningField[]> {
    return this.http.get<LearningField[]>(`${this.apiUrl}/user/${studentId}/training-modules`);
  }
}