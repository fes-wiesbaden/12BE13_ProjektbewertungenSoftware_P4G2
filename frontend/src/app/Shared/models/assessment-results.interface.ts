export interface GroupAssessmentStatisticsDto {
  groupId: string;
  totalMembers: number;
  totalSubmittedReviews: number;
  totalExpectedReviews: number;
  completionPercentage: number;
  memberStatistics: MemberStatisticsDto[];
}

export interface MemberStatisticsDto {
  memberId: string;
  memberName: string;
  averageRating: number;
  totalReviewsReceived: number;
  questionAverages: { [questionId: string]: number }; // Map<UUID, Double>
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

export interface ReviewAnswerDto {
  id: string;
  questionId: string;
  questionText: string;
  rate: number;
  comment?: string;
}


// In your component or interface file
export interface ReviewMatrix {
  reviewerId: string;
  reviewerName: string;
  ratings: {
    revieweeId: string;
    revieweeName: string;
    questionRatings: {
      questionId: string;
      questionText: string;
      rating: number;
    }[];
  }[];
}
