import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Review, ReviewJson } from '../../../Interfaces/review.interface';
import { MyAssessmentService } from './my-assessment.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-my-results',
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './my-assessment.html',
  styleUrl: './my-assessment.css',
})
export class MyAssessment {
  constructor(
    private fb: FormBuilder,
    private reviewService: MyAssessmentService,
    private authService: AuthService
  ) {
    // Für jedes Mitglied ein Pflichtfeld (required)
    this.form = this.fb.group({});
    this.members.forEach((m) => {
      this.form.addControl(`rating_${m.id}`, this.fb.control(null, Validators.required));
    });
  }

  form: FormGroup;
  reviewJson: ReviewJson[] = [];

  questions: { id: string; questionText: string }[] = [];

  frage = 0;

  members = [
    { id: 0, name: 'Teammitglied 1' },
    { id: 1, name: 'Teammitglied 2' },
    { id: 2, name: 'Teammitglied 3' },
    { id: 3, name: 'Teammitglied 4' },
    { id: 4, name: 'Teammitglied 5' },
  ];

  ratings: number[] = this.members.map((_) => 0);

  ngOnInit(): void {
    this.reviewService.getQuestions().subscribe((data) => {
      this.questions = data;
    });
  }

  setRating(memberId: number, value: number) {
    this.ratings[memberId] = value;
  }

  deleteAll() {
    this.ratings = this.members.map((_) => 0);
    this.reviewJson = [];
    this.frage = 0;
  }

  addRating() {
    if (this.frage + 1 > this.questions.length - 1) {
      this.submitRating();
      return;
    }

    const missing = this.members.filter((m) => this.ratings[m.id] === 0).map((m) => m.name);

    if (missing.length > 0) {
      alert(`❌ Folgende Mitglieder fehlen noch: ${missing.join(', ')}`);
    } else {
      this.createJson(this.questions[this.frage].id);
      this.ratings = [0, 0, 0, 0, 0];

      if (this.frage < this.questions.length - 1) {
        this.frage++;
      }
    }
  }

  createJson(currentQuestionId: string) {
    const students = this.members.map((m) => ({
      studentID: m.id,
      grade: this.ratings[m.id],
    }));
    const question = this.questions.find((q) => q.id === currentQuestionId);

    const json: ReviewJson = {
      questionID: currentQuestionId,
      questionText: question?.questionText ?? '',
      students: students,
    };

    this.reviewJson.push(json);
  }

  submitRating() {
    const reviewPayload: Review = {
      questionId: '',
      projectId: '1', //this.projectId,
      userId: this.authService.getUserId(),
      date: new Date().toISOString(),
      review: this.reviewJson,
    };

    this.reviewService.createSelbstFremd(reviewPayload).subscribe((res) => {
      console.log('Gespeichert:', res);
    });
  }
}
