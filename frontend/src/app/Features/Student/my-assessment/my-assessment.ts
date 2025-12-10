import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-my-results',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './my-assessment.html',
  styleUrl: './my-assessment.css'
})
export class MyAssessment {


  form: FormGroup;

  bewertung = new Map<string, number[]>();
  questions = [
    {
      id: 0,
      question: 'Wie schätzen Sie das Engagement im Projekt ein?'
    },

    {
      id: 1,
      question: 'Wie zielgerichtet wurde an der Aufgabenstellung gearbeitet?'
    },

    {
      id: 2,
      question: 'Wie beurteilen Sie die Zusammenarbeit mit den anderen Gruppenmitgliedern?'
    },

    {
      id: 3,
      question: 'Wie beurteilen Sie das Arbeitsverhalten?'
    },

    {
      id: 4,
      question: 'Wie beurteilen Sie das Engagement hinsichtlich der Aufgabenbearbeitung am Arduino mit Sensoren/Aktoren?'
    },

    {
      id: 5,
      question: 'Beurteilen Sie das Engagement bei der Realisierung der Netzwerk-Funktionalität (MQTT/Vernetzung)?'
    },

    {
      id: 6,
      question: 'Wie war das Engagement bei der Umsetzung der Datenbank?'
    },

    {
      id: 7,
      question: 'Wie war das Engagement bei der Gestaltung und Entwicklung der Benutzerschnittstellen?'
    },

    {
      id: 8,
      question: 'Beurteilen Sie das Engagement bei der Realisierung der Funktionalität (Java-Backend/Vernetzung)?'
    },

    {
      id: 9,
      question: 'Beurteilen Sie die Mitarbeit bei der Erstellung des Werbeflyers?'
    },

    {
      id: 10,
      question: 'Welche Gesamtnote würden Sie der jeweiligen Person für Ihren Beitrag zum Gelingen des Projektes geben?'
    }
  ];

  fullJson: Array<{
    questionID: number;
    questionText: string;
    students: Array<{ studentID: number; grade: number }>;
  }> = [];
  frage = 0;

  members = [
    { id: 0, name: 'Teammitglied 1' },
    { id: 1, name: 'Teammitglied 2' },
    { id: 2, name: 'Teammitglied 3' },
    { id: 3, name: 'Teammitglied 4' },
    { id: 4, name: 'Teammitglied 5' }
  ];

  ratings: number[] = this.members.map(_ => 0);

  constructor(private fb: FormBuilder) {
    // Für jedes Mitglied ein Pflichtfeld (required)
    this.form = this.fb.group({});
    this.members.forEach(m => {
      this.form.addControl(
        `rating_${m.id}`,
        this.fb.control(null, Validators.required)
      );
    });
  }

  setRating(memberId: number, value: number) {
    this.ratings[memberId] = value;
  }

  deleteAll() {
    this.bewertung.clear();
    this.ratings = this.members.map(_ => 0);
    this.fullJson = [];
    this.frage = 0;
  }

  submitRating() {
    const missing: string[] = [];

    this.members.forEach(m => {
      const ctrl = this.ratings[m.id];
      if (ctrl === 0) {
        missing.push(m.name);
      }
    });

    if (missing.length > 0) {
      alert(`❌ Folgende Mitglieder fehlen noch: ${missing.join(', ')}`);
      this.form.markAllAsTouched();
    } else {
      this.bewertung.set(this.questions[this.frage].question, this.ratings);
      if (this.fullJson.length < this.questions.length) {
        this.createJson(this.questions[this.frage].id, this.members, this.ratings);
      }
      this.ratings = [0, 0, 0, 0, 0];
      if (this.frage < this.questions.length - 1) {
        this.frage++;
      }
    }
  }


  createJson(currentQuestion: number, members: { id: number; name: string }[], ratings: number[]) {

    const students = members.map(m => ({
      studentID: m.id,
      grade: ratings[m.id]
    }));

    const questionText = this.questions[currentQuestion].question;
    const json = {
      questionID: currentQuestion,
      questionText: questionText,
      students: students
    };

    this.fullJson.push(json);

  }
}


