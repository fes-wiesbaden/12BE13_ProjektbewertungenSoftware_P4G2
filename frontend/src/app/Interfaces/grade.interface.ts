export interface Grade {
  id: string;
  value: number;
  gradeWeighting: number;
  date: string;
}

export interface AddGrade {
    value: number;
    weighting: number;
}