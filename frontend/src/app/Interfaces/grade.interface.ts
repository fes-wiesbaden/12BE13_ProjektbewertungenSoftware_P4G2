export interface Grade {
  id: string;
  gradeName: string;
  value: number;
  gradeWeighting: number;
  date: string;
}

export interface AddGrade {
  gradeName: string;
  value: number;
  gradeWeighting: number;
}
