import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GroupService } from '../../../Shared/Services/group-member.service';
import { AuthService } from '../../../core/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MyAssessmentService } from '../../../Shared/Services/my-assessment.service';

export interface Group {
  groupId: string;
  groupName: string;
}
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-my-results',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
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
    {
      id: 0,
      questionText: 'Wie schätzen Sie das Engagement im Projekt ein?',
    },

    {
      id: 1,
      questionText: 'Wie zielgerichtet wurde an der Aufgabenstellung gearbeitet?',
    },

    {
      id: 2,
      questionText: 'Wie beurteilen Sie die Zusammenarbeit mit den anderen Gruppenmitgliedern?',
    },

    {
      id: 3,
      questionText: 'Wie beurteilen Sie das Arbeitsverhalten?',
    },

    {
      id: 4,
      questionText:
        'Wie beurteilen Sie das Engagement hinsichtlich der Aufgabenbearbeitung am Arduino mit Sensoren/Aktoren?',
    },

    {
      id: 5,
      questionText:
        'Beurteilen Sie das Engagement bei der Realisierung der Netzwerk-Funktionalität (MQTT/Vernetzung)?',
    },

    {
      id: 6,
      questionText: 'Wie war das Engagement bei der Umsetzung der Datenbank?',
    },

    {
      id: 7,
      questionText:
        'Wie war das Engagement bei der Gestaltung und Entwicklung der Benutzerschnittstellen?',
    },

    {
      id: 8,
      questionText:
        'Beurteilen Sie das Engagement bei der Realisierung der Funktionalität (Java-Backend/Vernetzung)?',
    },

    {
      id: 9,
      questionText: 'Beurteilen Sie die Mitarbeit bei der Erstellung des Werbeflyers?',
    },

    {
      id: 10,
      questionText:
        'Welche Gesamtnote würden Sie der jeweiligen Person für Ihren Beitrag zum Gelingen des Projektes geben?',
    },
  ];
  question: { id: number; questionText: string }[] = [];

  groups: Group[] = [];
  selectedGroupId: string = '';
  evaluatedGroups: Set<string> = new Set(); // speichert bereits bewertete Gruppen

  members: { id: string; fullName: string; memberNumberId: number }[] = [];
  ratings: number[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private authService: AuthService,
    private http: HttpClient,
    private reviewService: MyAssessmentService,
     public i18n: TranslationService) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.loadGroups();
    this.reviewService.getQuestions().subscribe((data) => {
      this.question = data;
    });
    this.loadQuestions(); // Fragen vom Backend holen
  }

  loadQuestions() {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Kein Token gefunden');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<
        { id: number; questionText: string }[]
      >('http://localhost:4100/api/questions', { headers })
      .subscribe({
        next: (data) => {
          console.log('Fragen geladen:', data);
          this.questions = data;
        },
        error: (err) => console.error('Fehler beim Laden der Fragen', err),
      });
  }

  loadGroups() {
    this.groupService.getAllGroupsForMember(this.authService.getUserId()).subscribe({
      next: (data: any[]) => {
        this.groups = data.map((g) => ({
          groupId: g.groupId,
          groupName: g.groupName,
        }));
      },
      error: (err) => console.error('Fehler beim Laden der Gruppen', err),
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
          memberNumberId: idx,
        }));
        this.ratings = this.members.map(() => 0);

        // FormControls
        this.members.forEach((m) => {
          this.form.addControl(
            `rating_${m.memberNumberId}`,
            this.fb.control(null, Validators.required),
          );
        });
      },
      error: (err) => console.error('Fehler beim Laden der Mitglieder', err),
    });
  }

  setRating(memberNumberId: number, value: number) {
    if (this.frage >= this.question.length) return; // keine Bewertung möglich
    this.ratings[memberNumberId] = value;
  }

  submitRating() {
    if (this.frage >= this.question.length) return;

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
    this.bewertung.set(this.questions[this.frage].questionText, this.ratings);
    this.createJson(this.questions[this.frage].id, this.members, this.ratings);

    this.ratings = this.members.map(() => 0);

    // Nächste Frage oder fertig
    if (this.frage < this.question.length - 1) {
      this.frage++;
    } else {
      // Alle Fragen beantwortet -> Gruppe als bewertet markieren
      if (this.selectedGroupId) this.evaluatedGroups.add(this.selectedGroupId);
      this.sendReviewToBackend(this.authService.getUserId(), this.selectedGroupId, this.fullJson);
      alert('Alle Fragen für diese Gruppe wurden beantwortet.');
      this.members = []; // Bewertung nicht mehr möglich
    }
  }

  createJson(
    currentQuestion: number,
    members: { id: string; fullName: string; memberNumberId: number }[],
    ratings: number[],
  ) {
    const students = members.map((m) => ({
      studentID: m.id,
      grade: ratings[m.memberNumberId],
    }));

    this.fullJson.push({
      questionID: currentQuestion,
      questionText: this.question[currentQuestion].questionText,
      students,
    });
  }

  deleteAll() {
    this.bewertung.clear();
    this.ratings = this.members.map(() => 0);
    this.fullJson = [];
    this.frage = 0;
  }

  sendReviewToBackend(userId: string, groupId: string, reviewData: any) {
    if (!userId || !groupId) {
      console.error('UserId oder GroupId fehlt.');
      return;
    }

    const url = `http://localhost:4100/api/user/${userId}/project/${groupId}/review`;

    this.http.post(url, reviewData).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Fehler beim Senden der Review', err);
        alert('Fehler beim Senden der Bewertung!');
      },
    });
  }
}
