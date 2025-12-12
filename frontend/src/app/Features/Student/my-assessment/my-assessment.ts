import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../Shared/Services/group-member.service';

@Component({
  selector: 'app-my-results',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './my-assessment.html',
  styleUrl: './my-assessment.css',
})
export class MyAssessment {
  form: FormGroup;
  bewertung = new Map<string, number[]>();
  fullJson: Array<{
    questionID: number;
    questionText: string;
    students: Array<{ studentID: string; grade: number }>;
  }> = [];
  frage = 0;

  questions = [
    { id: 0, question: 'Wie schätzen Sie das Engagement im Projekt ein?' },
    { id: 1, question: 'Wie zielgerichtet wurde an der Aufgabenstellung gearbeitet?' },
    // ... weitere Fragen
  ];

  // Members bekommen nun eine number-id für das Frontend
  members: { id: string; fullName: string; memberNumberId: number }[] = [];
  ratings: number[] = [];

  constructor(private fb: FormBuilder, private groupService: GroupService) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.loadMembers('33799e78-135d-404f-951b-976d20aa397f'); // Beispiel: groupId
  }

  loadMembers(groupId: string) {
    this.groupService.getMembersByGroupId(groupId).subscribe({
      next: (data: any[]) => {
        console.log(data);
        this.members = data.map((m, idx) => ({
          id: m.memberId,           // UUID vom Backend
          fullName: m.fullName,
          memberNumberId: idx       // fortlaufende Number-ID fürs Frontend
        }));
console.log("Mapped members:", this.members);
        // Ratings-Array nach memberNumberId
        this.ratings = this.members.map(() => 0);

        // FormControls optional (falls du reactive forms benutzt)
        this.members.forEach(m => {
          this.form.addControl(`rating_${m.memberNumberId}`, this.fb.control(null, Validators.required));
        });
      },
      error: err => console.error('Fehler beim Laden der Mitglieder', err)
    });
  }

  setRating(memberNumberId: number, value: number) {
    this.ratings[memberNumberId] = value;
  }

  submitRating() {
    const missing: string[] = [];
    this.members.forEach((m, idx) => {
      if (this.ratings[idx] === 0) missing.push(m.fullName);
    });

    if (missing.length > 0) {
      alert(`❌ Folgende Mitglieder fehlen noch: ${missing.join(', ')}`);
      this.form.markAllAsTouched();
      return;
    }

    this.bewertung.set(this.questions[this.frage].question, this.ratings);
    this.createJson(this.questions[this.frage].id, this.members, this.ratings);

    this.ratings = this.members.map(() => 0);
    if (this.frage < this.questions.length - 1) this.frage++;
  }

  createJson(currentQuestion: number, members: { id: string; fullName: string; memberNumberId: number }[], ratings: number[]) {
    const students = members.map(m => ({
      studentID: m.id,      // UUID wird weiterhin im Backend genutzt
      grade: ratings[m.memberNumberId]
    }));

    this.fullJson.push({
      questionID: currentQuestion,
      questionText: this.questions[currentQuestion].question,
      students
    });
  }

  deleteAll() {
    this.bewertung.clear();
    this.ratings = this.members.map(() => 0);
    this.fullJson = [];
    this.frage = 0;
  }
}
