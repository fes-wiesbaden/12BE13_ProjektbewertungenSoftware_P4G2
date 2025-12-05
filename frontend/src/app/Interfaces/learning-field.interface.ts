export interface LearningField {
  id: string;
  name: string;
  weighting: number;
  grades: Grade[];
}

export interface Grade {
  id: string;
  value: number;
  gradeWeighting: number;
  date: string;
}