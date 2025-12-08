export interface Review {
  questionId: string;
  projectId: string;
  userId: string;
  date: string;
  review: ReviewJson[];
}
export interface ReviewJson {
  questionID: string;
  questionText: string;
  students: Array<{ studentID: number; grade: number }>;
}
