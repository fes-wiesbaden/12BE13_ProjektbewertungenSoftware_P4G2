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
import { MyAssessmentService } from '../../../Shared/Services/my-assessment.service';
import { TranslationService } from '../../../core/services/translation.service';
import { QuestionService } from '../../../Shared/Services/question.service';
import { IProject } from '../../../core/modals/project.modal';
import { ProjectService } from '../../../core/services/project.service';
import {AssessmentSubmissionDto, MemberRatingDto, QuestionRatingDto} from '../../../Shared/models/assessment.modal';
import {forkJoin} from 'rxjs';

export interface Group {
  groupId: string;
  groupName: string;
  projectId: string;
}

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

  // State management
  currentQuestionIndex = 0;
  ratingStarted = false;
  isLoading = false;
  isLoadingMembers = false;
  errorMessage = '';
  Math = Math;

  projectId: string = '';
  projectName: string = '';
  questions: any[] = [];
  allGroups: Group[] = [];
  projects: IProject[] = [];
  selectedGroup: Group | null = null;
  selectedProjectId: string = '';
  evaluatedGroupProjects: Map<string, string> = new Map();
  members: { id: string; fullName: string; memberNumberId: number }[] = [];
  ratings: { [key: string]: number } = {};

  allRatingsData: Map<number, Map<string, number>> = new Map();


  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private authService: AuthService,
    public i18n: TranslationService,
    private questionService: QuestionService,
    private projectService: ProjectService,
    private assessmentService: MyAssessmentService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    console.log('=== AUTH DEBUG ===');
    const token = this.authService.getToken();
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length);
    console.log('Token preview:', token?.substring(0, 50) + '...');
    console.log('User ID:', this.authService.getUserId());
    console.log('==================');

    this.loadUserGroupsAndProjects();
  }

  loadUserGroupsAndProjects() {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      this.errorMessage = 'Benutzer nicht angemeldet';
      this.isLoading = false;
      return;
    }

    // Load all groups for the user
    this.groupService.getAllGroupsForMember(userId).subscribe({
      next: (data: any[]) => {
        this.allGroups = data.map((g) => ({
          groupId: g.groupId,
          groupName: g.groupName,
          projectId: g.projectId,
        }));

        console.log('✅ Loaded user groups:', this.allGroups);

        // Get unique project IDs from user's groups
        const projectIds = [...new Set(this.allGroups.map(g => g.projectId))];

        if (projectIds.length === 0) {
          this.errorMessage = 'Sie sind keiner Gruppe zugewiesen.';
          this.isLoading = false;
          return;
        }

        // Load projects
        this.loadProjects(projectIds);
      },
      error: (err) => {
        console.error('❌ Error loading groups', err);
        this.errorMessage = 'Fehler beim Laden der Gruppen';
        this.isLoading = false;
      },
    });
  }

  loadProjects(projectIds: string[]) {
    this.projectService.getAllProjects().subscribe({
      next: (allProjects: IProject[]) => {
        // Filter only projects that the user has groups in
        this.projects = allProjects;
        console.log('✅ Loaded projects:', this.projects);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading projects', err);
        this.errorMessage = 'Fehler beim Laden der Projekte';
        this.isLoading = false;
      }
    });
  }

  getProject(projectId: string): IProject | undefined {
    return this.projects.find(p => p.id === projectId);
  }

  // When user selects a project, auto-select their group in that project
  onProjectSelect() {
    if (!this.selectedProjectId) {
      this.selectedGroup = null;
      this.members = [];
      this.questions = [];
      return;
    }

    // Find the user's group in the selected project
    const userGroupInProject = this.allGroups.find(g => g.projectId === this.selectedProjectId);

    if (userGroupInProject) {
      this.selectedGroup = userGroupInProject;
      this.projectId = this.selectedProjectId;
      this.projectName = this.getProject(this.projectId)?.title || this.projectId;

      // Check if already evaluated
      if (this.isAlreadyEvaluated()) {
        this.members = [];
        this.questions = [];
        return;
      }

      // Load questions and members
      this.loadQuestionsByProject(this.projectId);
      this.loadMembers(userGroupInProject.groupId);
    } else {
      this.errorMessage = 'Keine Gruppe für dieses Projekt gefunden.';
      this.selectedGroup = null;
      this.members = [];
      this.questions = [];
    }
  }

  // Check if user already submitted review for this group
  checkIfAlreadySubmitted(groupId: string) {
    const userId = this.authService.getUserId();
    this.assessmentService.checkIfAlreadySubmitted(userId, groupId).subscribe({
      next: (hasSubmitted) => {
        if (hasSubmitted) {
          const key = `${this.projectId}_${groupId}`;
          this.evaluatedGroupProjects.set(key, this.projectId);
        }
      },
      error: (err) => {
        console.error('Error checking submission status:', err);
      }
    });
  }

  isAlreadyEvaluated(): boolean {
    if (!this.selectedGroup) return false;
    const key = `${this.projectId}_${this.selectedGroup.groupId}`;
    return this.evaluatedGroupProjects.has(key);
  }

  loadQuestionsByProject(projectId: string) {
    this.questionService.getAllQuestionsByProjectId(projectId).subscribe({
      next: (questions) => {
        this.questions = questions;
        console.log('✅ Loaded questions:', questions);
      },
      error: (err) => {
        console.error('❌ Error loading questions:', err);
        this.errorMessage = 'Fehler beim Laden der Fragen';
      }
    });
  }

  loadMembers(groupId: string) {
    this.isLoadingMembers = true;
    this.groupService.getMembersByGroupId(groupId).subscribe({
      next: (data: any[]) => {
        this.members = data.map((m, idx) => ({
          id: m.id,
          fullName: m.fullName,
          memberNumberId: idx,
        }));

        this.ratings = {};
        this.members.forEach((m) => {
          this.ratings[m.id] = 0;
        });

        this.members.forEach((m) => {
          if (!this.form.contains(`rating_${m.memberNumberId}`)) {
            this.form.addControl(
              `rating_${m.memberNumberId}`,
              this.fb.control(null, Validators.required)
            );
          }
        });

        console.log('✅ Loaded members:', this.members);
        this.isLoadingMembers = false;
      },
      error: (err) => {
        console.error('❌ Error loading members:', err);
        this.errorMessage = 'Fehler beim Laden der Mitglieder';
        this.isLoadingMembers = false;
      },
    });
  }

  startRating() {
    if (!this.selectedProjectId) {
      alert('Bitte wählen Sie ein Projekt aus.');
      return;
    }
    if (!this.selectedGroup) {
      alert('Keine Gruppe gefunden.');
      return;
    }
    if (this.members.length === 0) {
      alert('Keine Mitglieder in dieser Gruppe gefunden.');
      return;
    }
    if (this.questions.length === 0) {
      alert('Keine Fragen verfügbar.');
      return;
    }

    this.ratingStarted = true;
    this.currentQuestionIndex = 0;
    this.resetRatingsForCurrentQuestion();
  }

  setRating(memberId: string, value: number) {
    this.ratings[memberId] = value;
  }

  allMembersRated(): boolean {
    return this.members.every(
      (member) => this.ratings[member.id] && this.ratings[member.id] > 0
    );
  }

  resetRatingsForCurrentQuestion() {
    this.members.forEach((m) => {
      this.ratings[m.id] = 0;
    });
  }

  nextQuestion() {
    if (!this.allMembersRated()) {
      alert('Bitte bewerten Sie alle Mitglieder.');
      return;
    }

    this.saveCurrentRatings();

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetRatingsForCurrentQuestion();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.resetRatingsForCurrentQuestion();
    }
  }

  saveCurrentRatings() {
    const currentQuestion = this.questions[this.currentQuestionIndex];

    if (!currentQuestion) {
      console.error('❌ Question not found at index:', this.currentQuestionIndex);
      return;
    }

    // Store ratings for this question
    const questionRatings = new Map<string, number>();
    this.members.forEach((m) => {
      questionRatings.set(m.id, this.ratings[m.id]);
    });

    this.allRatingsData.set(currentQuestion.id, questionRatings);

    console.log('✅ Saved ratings for question:', currentQuestion.id);
  }

  submitRating() {
    if (!this.allMembersRated()) {
      alert('Bitte bewerten Sie alle Mitglieder.');
      return;
    }

    // Save the last question's ratings
    this.saveCurrentRatings();

    const userId = this.authService.getUserId();
    const groupId = this.selectedGroup!.groupId;

    console.log('📝 Submitting ratings for user:', userId);
    console.log('📝 Group:', groupId);
    console.log('📝 Project:', this.projectId);

    // Build question ratings grouped by question
    const questionRatings: QuestionRatingDto[] = [];

    // For each question, collect all member ratings
    this.questions.forEach(question => {
      const ratingsForQuestion = this.allRatingsData.get(question.id);

      if (ratingsForQuestion) {
        const memberRatings: MemberRatingDto[] = [];

        // Get ratings for all members for this question
        this.members.forEach(member => {
          const rating = ratingsForQuestion.get(member.id) || 0;

          memberRatings.push({
            revieweeId: member.id,
            rating: rating
          });
        });

        questionRatings.push({
          questionId: question.id,
          ratings: memberRatings
        });
      }
    });

    // Create ONE submission with all question ratings
    const submission: AssessmentSubmissionDto = {
      reviewerId: userId,
      groupId: groupId,
      isSubmitted: true,
      submissionDate: new Date().toISOString(),
      creationDate: new Date().toISOString(),
      questionRatings: questionRatings
    };

    console.log('📦 Final submission:', JSON.stringify(submission, null, 2));

    // Submit single assessment with all ratings
    this.submitAssessment(submission);
  }

  // Update to submit single assessment instead of multiple
  submitAssessment(submission: AssessmentSubmissionDto) {
    this.assessmentService.submitAssessment(submission).subscribe({
      next: (result) => {
        console.log('✅ Assessment submitted successfully:', result);
        alert('Bewertung erfolgreich abgeschlossen!');

        // Mark as evaluated
        if (this.selectedGroup) {
          const key = `${this.projectId}_${this.selectedGroup.groupId}`;
          this.evaluatedGroupProjects.set(key, this.projectId);
        }

        this.resetAfterSubmit();
      },
      error: (err) => {
        console.error('❌ Error submitting assessment:', err);
        console.error('❌ Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });

        if (err.status === 401) {
          console.log('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
        } else if (err.status === 0) {
          console.log('Keine Verbindung zum Server. Bitte überprüfen Sie Ihre Internetverbindung.');
        } else {
          console.log('Fehler beim Senden der Bewertung! Bitte versuchen Sie es erneut.');
        }
      }
    });
  }

  submitAllAssessments(submissions: AssessmentSubmissionDto[]) {
    const submissionObservables = submissions.map(submission => {
      console.log("The Submission: " + JSON.stringify(submission));
      return this.assessmentService.submitAssessment(submission); // ADD 'return' here!
    });

    // Modern forkJoin syntax (not deprecated)
    forkJoin(submissionObservables).subscribe({
      next: (results) => {
        console.log('✅ All assessments submitted:', results);
        alert('Bewertung erfolgreich abgeschlossen!');

        // Mark as evaluated
        if (this.selectedGroup) {
          const key = `${this.projectId}_${this.selectedGroup.groupId}`;
          this.evaluatedGroupProjects.set(key, this.projectId);
        }

        this.resetAfterSubmit();
      },
      error: (err) => {
        console.error('❌ Error submitting assessments:', err);
        console.error('❌ Error details:', {
          status: err.status,
          message: err.message,
          error: err.error
        });

        if (err.status === 401) {
          alert('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
        } else if (err.status === 0) {
          alert('Keine Verbindung zum Server möglich.');
        } else {
          alert('Fehler beim Senden der Bewertung! Bitte versuchen Sie es erneut.');
        }
      }
    });
  }

  resetAfterSubmit() {
    this.ratingStarted = false;
    this.currentQuestionIndex = 0;
    this.fullJson = [];
    this.bewertung.clear();
    this.members = [];
    this.questions = [];
    this.ratings = {};
  }

  // createJson(
  //   questionId: number,
  //   members: { id: string; fullName: string; memberNumberId: number }[],
  //   ratings: number[]
  // ) {
  //   const question = this.questions.find(q => q.id === questionId);
  //
  //   if (!question) {
  //     console.error('❌ Question not found with ID:', questionId);
  //     return;
  //   }
  //
  //   const students = members.map((m) => ({
  //     studentID: m.id,
  //     grade: this.ratings[m.id],
  //   }));
  //
  //   this.fullJson.push({
  //     questionID: question.id,
  //     questionText: question.questionText,
  //     students,
  //   });
  // }

  deleteAll() {
    this.bewertung.clear();
    this.resetRatingsForCurrentQuestion();
    this.fullJson = [];
    this.currentQuestionIndex = 0;
  }

  getRatingValue(memberId: string): number {
    return this.ratings[memberId] || 0;
  }

  getStarColor(memberId: string, starValue: number): string {
    const rating = this.getRatingValue(memberId);
    if (rating < starValue) {
      return 'text-gray-300 dark:text-gray-600';
    }

    switch (rating) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-lime-500';
      case 5: return 'text-green-500';
      case 6: return 'text-emerald-600';
      default: return 'text-gray-300 dark:text-gray-600';
    }
  }

  getProjectStatusColor(status?: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on-hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }
}
