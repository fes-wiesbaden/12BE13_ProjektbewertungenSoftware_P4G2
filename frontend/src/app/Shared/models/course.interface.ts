export interface AddCourse {
  name: string;
  learningFieldsIds: String[];
}

export interface Course {
  id: string;
  courseName: string;
  className: string;
  learningFieldIds: string[];
  learningFieldNames: string[];
}

export interface ConnectCourse {
  id: string;
}

export interface UpdateCourse {
  id: string;
  name: string;
  learningFieldsIds: String[];
}