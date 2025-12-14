import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AssessmentResultsService } from '../../../Shared/Services/assessment-results.service';
import { ProjectService } from '../../../core/services/project.service';
import { GroupService } from '../../../core/services/group.service'; // ADD THIS
import { QuestionService } from '../../../Shared/Services/question.service';
import {
  ReviewResponseDto,
  ReviewMatrix
} from '../../../Shared/models/assessment-results.interface';
import { IProject } from '../../../core/modals/project.modal';
import { IGroup } from '../../../core/modals/group.modal';

interface QuestionInfo {
  id: string;
  questionText: string;
}

interface MemberInfo {
  id: string;
  name: string;
  userName: string;
  fullName: string;
}

@Component({
  selector: 'app-teacher-assessment-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './teacher-assessment-results.html',
  styleUrls: ['./teacher-assessment-results.css']
})
export class TeacherAssessmentResults implements OnInit {
  projects: IProject[] = [];
  groups: IGroup[] = [];
  questions: QuestionInfo[] = [];
  selectedProjectId = '';
  selectedGroupId = '';
  reviewDetails: ReviewResponseDto[] = [];
  reviewMatrix: ReviewMatrix[] = [];
  isLoading = false;
  isLoadingStats = false;
  showDetailedMatrix = false;
  viewMode: 'overview' | 'details' | 'matrix' = 'overview';

  // Member-related properties
  selectedReviewerId = '';
  reviewers: { id: string; name: string }[] = [];
  reviewees: { id: string; name: string }[] = [];
  selectedReview: ReviewResponseDto[] | null = null;
  memberMap: Map<string, MemberInfo> = new Map();
  currentGroupMembers: MemberInfo[] = [];

  constructor(
    private assessmentService: AssessmentResultsService,
    private projectService: ProjectService,
    private groupService: GroupService, // ADD THIS
    private questionService: QuestionService
  ) {}

  ngOnInit() {
    this.loadProjectsWithGroups();
  }

  /* ---------------- PROJECTS ---------------- */
  loadProjectsWithGroups() {
    this.isLoading = true;
    this.projectService.getAllProjectsWithGroups().subscribe({
      next: projects => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onProjectChange() {
    this.groups = [];
    this.questions = [];
    this.selectedGroupId = '';
    this.reviewDetails = [];
    this.reviewMatrix = [];
    this.reviewers = [];
    this.reviewees = [];
    this.selectedReview = null;
    this.selectedReviewerId = '';
    this.memberMap.clear();
    this.currentGroupMembers = [];
    this.viewMode = 'overview';

    if (!this.selectedProjectId) return;

    const project = this.projects.find(p => p.id === this.selectedProjectId);
    this.groups = project?.groups ?? [];

    // Load questions
    this.questionService.getAllQuestionsByProjectId(this.selectedProjectId)
      .subscribe(qs => {
        this.questions = qs.map(q => ({
          id: q.id,
          questionText: q.questionText
        }));
      });

    if (this.groups.length > 0) {
      this.selectedGroupId = this.groups[0].id;
      this.onGroupChange();
    }
  }

  /* ---------------- GROUP ---------------- */
  onGroupChange() {
    if (!this.selectedGroupId) return;

    this.isLoading = true;
    this.selectedReviewerId = '';
    this.selectedReview = null;
    this.memberMap.clear();
    this.currentGroupMembers = [];

    // Fetch group details with members from server
    this.groupService.getGroupById(this.selectedGroupId).subscribe({
      next: groupDetails => {
        console.log('Group details loaded:', groupDetails);

        // Map members from the DTO
        if (groupDetails.members && Array.isArray(groupDetails.members)) {
          this.currentGroupMembers = groupDetails.members.map((member: any) => ({
            id: member.id,
            name: member.fullName || member.userName || 'Unknown',
            userName: member.userName,
            fullName: member.fullName
          }));

          console.log('Mapped members:', this.currentGroupMembers);

          // Build member map for quick lookup
          this.currentGroupMembers.forEach((member: MemberInfo) => {
            this.memberMap.set(member.id, member);
          });

          console.log('Member map built:', this.memberMap);
        }

        // Now fetch reviews
        this.fetchReviews();
      },
      error: (err) => {
        console.error('Error loading group details:', err);
        this.isLoading = false;
      }
    });
  }

  private fetchReviews() {
    this.assessmentService.getReviewsByGroup(this.selectedGroupId).subscribe({
      next: reviews => {
        console.log('Reviews loaded:', reviews);
        this.reviewDetails = reviews;

        // Map reviewers with names from memberMap
        const reviewerIds = Array.from(new Set(reviews.map(r => r.reviewerId)));
        this.reviewers = reviewerIds.map(id => {
          const member = this.memberMap.get(id);
          console.log(`Reviewer ${id}:`, member);
          return {
            id,
            name: member?.fullName || member?.userName || member?.name || 'Unknown User'
          };
        });

        console.log('Mapped reviewers:', this.reviewers);

        // Map reviewees with names from memberMap
        const revieweeIds = Array.from(new Set(reviews.map(r => r.revieweeId)));
        this.reviewees = revieweeIds.map(id => {
          const member = this.memberMap.get(id);
          console.log(`Reviewee ${id}:`, member);
          return {
            id,
            name: member?.fullName || member?.userName || member?.name || 'Unknown User'
          };
        });

        console.log('Mapped reviewees:', this.reviewees);

        // Build review matrix with names
        this.buildReviewMatrix();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoading = false;
      }
    });
  }

  onReviewerChange() {
    this.selectedReview = this.reviewDetails
      .filter(r => r.reviewerId === this.selectedReviewerId);
  }

  getReviewerName(): string {
    const reviewer = this.reviewers.find(r => r.id === this.selectedReviewerId);
    return reviewer?.name || 'Unknown Reviewer';
  }

  /* ---------------- MATRIX ---------------- */
  buildReviewMatrix() {
    const reviewerMap = new Map<string, ReviewResponseDto[]>();

    this.reviewDetails.forEach(review => {
      if (!reviewerMap.has(review.reviewerId)) {
        reviewerMap.set(review.reviewerId, []);
      }
      reviewerMap.get(review.reviewerId)!.push(review);
    });

    this.reviewMatrix = Array.from(reviewerMap.entries()).map(
      ([reviewerId, reviews]) => {
        const reviewerMember = this.memberMap.get(reviewerId);
        const reviewerName = reviewerMember?.fullName
          || reviewerMember?.userName
          || reviewerMember?.name
          || 'Unknown Reviewer';

        return {
          reviewerId,
          reviewerName,
          ratings: reviews.map(r => {
            const revieweeMember = this.memberMap.get(r.revieweeId);
            const revieweeName = revieweeMember?.fullName
              || revieweeMember?.userName
              || revieweeMember?.name
              || 'Unknown Member';

            return {
              revieweeId: r.revieweeId,
              revieweeName,
              questionRatings: r.answers.map(a => ({
                questionId: a.questionId,
                questionText: a.questionText,
                rating: a.rate
              }))
            };
          })
        };
      }
    );

    console.log('Review matrix built:', this.reviewMatrix);
  }

  /* ---------------- HELPERS ---------------- */
  getMemberName(memberId: string): string {
    const member = this.memberMap.get(memberId);
    if (!member) {
      console.warn(`Member not found for ID: ${memberId}`);
      return 'Unknown';
    }
    return member.fullName || member.userName || member.name || 'Unknown';
  }

  getRating(questionId: string, revieweeId: string): number | null {
    const review = this.selectedReview
      ?.find(r => r.revieweeId === revieweeId);
    return review?.answers.find(a => a.questionId === questionId)?.rate ?? null;
  }

  /* ---------------- UI ---------------- */
  switchToMatrix() {
    this.viewMode = 'matrix';
  }

  toggleDetailedMatrix() {
    this.showDetailedMatrix = !this.showDetailedMatrix;
  }

  getRatingTextColor(r: number | null) {
    if (r === null) return 'text-gray-400';
    if (r >= 5) return 'text-green-600 dark:text-green-400';
    if (r >= 4) return 'text-lime-600 dark:text-lime-400';
    if (r >= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (r >= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }

  getRatingBgColor(r: number | null) {
    if (r === null) return 'bg-gray-50 dark:bg-gray-800';
    if (r >= 5) return 'bg-green-100 dark:bg-green-900/30';
    if (r >= 4) return 'bg-lime-100 dark:bg-lime-900/30';
    if (r >= 3) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (r >= 2) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  }
}
