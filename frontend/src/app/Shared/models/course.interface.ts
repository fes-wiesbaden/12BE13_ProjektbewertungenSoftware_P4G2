import { LearningField } from "./learning-fields.interface";

export interface AddCourse {
  name: string;
  learnfields: LearningField[];
}

export interface Course {
  id: string;
  courseName: string;
  className: string;
  learnfields: LearningField[];
}

export interface ConnectCourse {
  id: string;
}
