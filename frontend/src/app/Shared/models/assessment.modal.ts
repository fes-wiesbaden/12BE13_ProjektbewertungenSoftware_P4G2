// Individual rating for one member on one question
export interface MemberRating {
  memberId: string;
  memberName: string;
  rating: number;
}

// All ratings for one question
export interface QuestionRating {
  questionId: number;
  questionText: string;
  ratings: MemberRating[];
}

// Complete assessment submission
// export interface AssessmentSubmissionDto {
//   assessorId: string;
//   groupId: string;
//   projectId?: string;
//   questionRatings: QuestionRating[];
//   submittedAt: Date;
// }

// Response from backend
export interface AssessmentResponseDto {
  id: string;
  assessorId: string;
  groupId: string;
  status: 'SUBMITTED' | 'PENDING' | 'COMPLETED';
  submittedAt: Date;
  totalQuestions: number;
  totalRatings: number;
}


// assessment.interface.ts
export interface AssessmentSubmissionDto {
  id?: string;
  reviewerId: string;
  groupId: string;
  comment?: string;
  isSubmitted: boolean;
  submissionDate?: string;
  creationDate?: string;
  answers?: ReviewAnswerDto[];
  questionRatings: QuestionRatingDto[];
}

export interface QuestionRatingDto {
  questionId: string;
  ratings: MemberRatingDto[];
}

export interface MemberRatingDto {
  revieweeId: string;
  rating: number;
  comment?: string;
}

export interface ReviewAnswerDto {
  id?: string;
  questionId: number;
  answer?: string;
  rating: number;
}



// export interface AssessmentSubmissionDto {
//   id?: string;
//   reviewerId: string;
//   revieweeId: string;
//   groupId: string;
//   comment?: string;
//   isSubmitted: boolean;
//   submissionDate?: string;
//   creationDate?: string;
//   answers?: ReviewAnswerDto[];
//   questionRatings: QuestionRatingDto[];
// }

// export interface QuestionRatingDto {
//   questionId: number;
//   questionText: string;
//   revieweeId: string;
//   rating: number;
// }

export interface ReviewAnswerDto {
  id?: string;
  questionId: number;
  answer?: string;
  rating: number;
}

export interface ReviewResponseDto {
  id: string;
  reviewerId: string;
  revieweeId: string;
  groupId: string;
  comment?: string;
  isSubmitted: boolean;
  submissionDate: string;
  creationDate: string;
  answers: ReviewAnswerDto[];
}

export interface GroupAssessmentStatisticsDto {
  groupId: string;
  totalReviews: number;
  averageRating: number;
  memberStatistics: MemberStatistic[];
}

export interface MemberStatistic {
  memberId: string;
  memberName: string;
  averageRating: number;
  reviewCount: number;
}
