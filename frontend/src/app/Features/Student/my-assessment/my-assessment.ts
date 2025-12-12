import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../Shared/Services/group-member.service';
import { AuthService } from '../../../core/auth/auth.service';

export interface Group {
  groupId: string;
  groupName: string;
}

@Component({
  selector: 'app-my-results',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, CommonModule, FormsModule],
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

  groups: Group[] = [];
  selectedGroupId: string = '';
  evaluatedGroups: Set<string> = new Set(); // speichert bereits bewertete Gruppen

  members: { id: string; fullName: string; memberNumberId: number }[] = [];
  ratings: number[] = [];

  constructor(private fb: FormBuilder, private groupService: GroupService, private authService: AuthService) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getAllGroupsForMember(this.authService.getUserId()).subscribe({
      next: (data: any[]) => {
        this.groups = data.map(g => ({
          groupId: g.groupId,
          groupName: g.groupName
        }));
      },
      error: err => console.error('Fehler beim Laden der Gruppen', err)
    });
  }

  onGroupChange() {
    if (!this.selectedGroupId) return;

    // Prüfen, ob Gruppe schon bewertet wurde
    if (this.evaluatedGroups.has(this.selectedGroupId)) {
      alert('Diese Gruppe wurde bereits bewertet.');
      this.members = [];
      return;
    }

    this.loadMembers(this.selectedGroupId);
  }

  loadMembers(groupId: string) {
    this.groupService.getMembersByGroupId(groupId).subscribe({
      next: (data: any[]) => {
        this.members = data.map((m, idx) => ({
          id: m.memberId,
          fullName: m.fullName,
          memberNumberId: idx
        }));
        this.ratings = this.members.map(() => 0);

        // FormControls
        this.members.forEach(m => {
          this.form.addControl(`rating_${m.memberNumberId}`, this.fb.control(null, Validators.required));
        });
      },
      error: err => console.error('Fehler beim Laden der Mitglieder', err)
    });
  }

  setRating(memberNumberId: number, value: number) {
    if (this.frage >= this.questions.length) return; // keine Bewertung möglich
    this.ratings[memberNumberId] = value;
  }

  submitRating() {
    if (this.frage >= this.questions.length) return;

    const missing: string[] = [];
    this.members.forEach((m, idx) => {
      if (this.ratings[idx] === 0) missing.push(m.fullName);
    });

    if (missing.length > 0) {
      alert(`❌ Folgende Mitglieder fehlen noch: ${missing.join(', ')}`);
      this.form.markAllAsTouched();
      return;
    }

    // Bewertung speichern
    this.bewertung.set(this.questions[this.frage].question, this.ratings);
    this.createJson(this.questions[this.frage].id, this.members, this.ratings);

    this.ratings = this.members.map(() => 0);

    // Nächste Frage oder fertig
    if (this.frage < this.questions.length - 1) {
      this.frage++;
    } else {
      // Alle Fragen beantwortet -> Gruppe als bewertet markieren
      if (this.selectedGroupId) this.evaluatedGroups.add(this.selectedGroupId);
      alert('Alle Fragen für diese Gruppe wurden beantwortet.');
      this.members = []; // Bewertung nicht mehr möglich
    }
  }

  createJson(currentQuestion: number, members: { id: string; fullName: string; memberNumberId: number }[], ratings: number[]) {
    const students = members.map(m => ({
      studentID: m.id,
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
