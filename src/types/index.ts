export interface Drug {
  id: string;
  name: string;
  category: string;
  indications: string[];
  mechanism: string;
  adverseReactions: string[];
  contraindications: string[];
  dosage: string;
  description: string;
}

export type InteractionSeverity = "contraindicated" | "severe" | "moderate" | "mild";

export interface DrugInteraction {
  id: string;
  drugAId: string;
  drugBId: string;
  severity: InteractionSeverity;
  description: string;
  mechanism: string;
  clinicalSignificance: string;
  recommendation: string;
  references: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  drugCombination: string[];
  severity: InteractionSeverity;
  caseDescription: string;
  interactionMechanism: string;
  clinicalOutcome: string;
  preventionAdvice: string;
  learningPoints: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ChapterQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  order: number;
  quizzes: ChapterQuiz[];
}

export type LearningStatus = "not-started" | "in-progress" | "completed";

export interface LearningProgress {
  chapterId: string;
  status: LearningStatus;
  score: number;
  completedDate?: string;
}

export interface QuizHistory {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  questionIds: string[];
  userAnswers: number[];
}

export interface AppState {
  learningProgress: LearningProgress[];
  quizHistory: QuizHistory[];
  currentQuiz: {
    questions: QuizQuestion[];
    currentIndex: number;
    userAnswers: number[];
  } | null;
}

export interface AppActions {
  updateChapterProgress: (chapterId: string, status: LearningStatus, score?: number) => void;
  startQuiz: (questions: QuizQuestion[]) => void;
  answerCurrentQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => QuizHistory;
  clearCurrentQuiz: () => void;
}
