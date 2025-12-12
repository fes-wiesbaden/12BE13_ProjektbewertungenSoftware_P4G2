import { Grade } from '../../Interfaces/grade.interface';

export interface LearningField {
  id: string;
  name: string;
  description: string;
  weightingHours: number;
  averageGrade?: number | null;
  weightSum?: number;
  gradeCount?: number;
  grades?: Grade[];
}

export interface AddLearningfield {
  name: string;
  description: string;
  weightingHours: number;
}

export interface TrainingModuleWithAverageDto {
  userId: string;
  trainingModuleId: string;
  averageGrade: number | null;
  weightSum: number;
  gradeCount: number;
}
