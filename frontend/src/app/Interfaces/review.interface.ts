export interface Review {
  id: string;
  projectId: string;
  userId: string;
  date: string;
  review: ReviewJson[];
}
export interface ReviewJson {
  questionID: number;
  questionText: string;
  students: Array<{ studentID: number; grade: number }>;
}
