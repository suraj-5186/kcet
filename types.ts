
export type SubjectType = 'Physics' | 'Chemistry' | 'Mathematics';

export interface Question {
  id: string;
  subject: SubjectType;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface User {
  id: string;
  name: string;
  mobile?: string;
}

export interface Attempt {
  userId: string;
  subject: SubjectType;
  answers: Record<string, number>; // questionId -> selectedIndex
  score: number;
  total: number;
  timestamp: number;
}

export interface ExamState {
  currentSubject: SubjectType | null;
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<string, number>;
  startTime: number;
  isComplete: boolean;
}

export interface Scores {
  Physics: number | null;
  Chemistry: number | null;
  Mathematics: number | null;
}
