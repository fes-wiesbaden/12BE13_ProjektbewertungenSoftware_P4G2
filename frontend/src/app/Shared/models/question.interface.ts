// question.interface.ts
export interface AddQuestionDto {
  questionText: string;
  projectId: string;
}

export interface UpdateQuestionDto {
  questionId: string;
  questionText: string;
  projectId: string;
}

export interface QuestionResponseDto {
  id: string;
  questionText: string;
  projectId: string;
}
