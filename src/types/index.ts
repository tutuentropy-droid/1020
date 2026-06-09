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
  tags?: string[];
}

export interface WrongQuestion {
  questionId: string;
  wrongCount: number;
  lastWrongDate: string;
  wrongAnswers: number[];
  mastered: boolean;
}

export interface QuestionStats {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  lastAttemptDate?: string;
}

export interface SmartQuizConfig {
  wrongQuestionRatio: number;
  totalQuestions: number;
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

export type GraphNodeType = "drug" | "target" | "disease" | "sideEffect" | "enzyme" | "indication" | "antagonist";

export interface GraphNode {
  id: string;
  name: string;
  type: GraphNodeType;
  description?: string;
  category?: string;
}

export type GraphEdgeType =
  | "actsOn"
  | "treats"
  | "causes"
  | "interactsWith"
  | "metabolizedBy"
  | "indicatedFor"
  | "antagonizes";

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  label: string;
  description?: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface AppState {
  learningProgress: LearningProgress[];
  quizHistory: QuizHistory[];
  currentQuiz: {
    questions: QuizQuestion[];
    currentIndex: number;
    userAnswers: number[];
  } | null;
  wrongQuestions: WrongQuestion[];
  questionStats: QuestionStats[];
}

export interface AppActions {
  updateChapterProgress: (chapterId: string, status: LearningStatus, score?: number) => void;
  startQuiz: (questions: QuizQuestion[]) => void;
  answerCurrentQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => QuizHistory;
  clearCurrentQuiz: () => void;
  addWrongQuestion: (questionId: string, userAnswer: number) => void;
  removeWrongQuestion: (questionId: string) => void;
  markWrongQuestionMastered: (questionId: string) => void;
  updateQuestionStats: (questionId: string, isCorrect: boolean) => void;
  getQuestionAccuracy: (questionId: string) => number;
  getSmartQuizQuestions: (config?: Partial<SmartQuizConfig>, category?: string) => QuizQuestion[];
  clearWrongQuestions: () => void;
}
