export type TimelineEventType =
  | "discovery"
  | "clinical-trial"
  | "approval"
  | "safety-event"
  | "guideline"
  | "milestone";

export interface TimelineEvent {
  id: string;
  year: number;
  type: TimelineEventType;
  title: string;
  summary: string;
  details?: string;
  imageUrl?: string;
  references?: string[];
}

export interface Drug {
  id: string;
  name: string;
  category: string;
  indications: string[];
  mechanism: string;
  halfLife: string;
  metabolism: string;
  adverseReactions: string[];
  contraindications: string[];
  dosage: string;
  description: string;
  history?: TimelineEvent[];
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

export interface Note {
  id: string;
  title: string;
  content: string;
  type: "general" | "drug-compare";
  drugIds?: string[];
  createdAt: string;
  updatedAt: string;
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
  notes: Note[];
  journalComments: JournalComment[];
  currentUserName: string;
  currentUserId: string;
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
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  getArticleComments: (articleId: string) => JournalComment[];
  addJournalComment: (articleId: string, comment: Omit<JournalComment, "id" | "articleId" | "authorId" | "authorName" | "createdAt" | "likes" | "likedByUser" | "replies">) => JournalComment;
  likeJournalComment: (commentId: string) => void;
  replyToJournalComment: (commentId: string, content: string) => CommentReply;
  likeCommentReply: (commentId: string, replyId: string) => void;
}

export type Gender = "male" | "female";

export type CreatinineUnit = "mg/dL" | "μmol/L";

export interface PediatricDoseParams {
  adultDose: number;
  childWeight: number;
}

export interface PediatricDoseResult {
  childDose: number;
  formula: string;
  derivation: string[];
}

export interface CreatinineClearanceParams {
  age: number;
  weight: number;
  gender: Gender;
  creatinine: number;
  unit: CreatinineUnit;
}

export interface CreatinineClearanceResult {
  crcl: number;
  egfr: number;
  formula: string;
  derivation: string[];
  stage: string;
  stageColor: string;
}

export interface BodySurfaceAreaParams {
  height: number;
  weight: number;
}

export interface BodySurfaceAreaResult {
  bsa: number;
  formula: string;
  derivation: string[];
  method: string;
}

export interface LoadingDoseParams {
  targetConcentration: number;
  volumeOfDistribution: number;
  bioavailability: number;
}

export interface MaintenanceDoseParams {
  targetConcentration: number;
  clearance: number;
  bioavailability: number;
  dosingInterval: number;
}

export interface DoseResult {
  loadingDose?: number;
  maintenanceDose: number;
  dailyDose: number;
  formula: string;
  derivation: string[];
}

export interface TDMDrugParam {
  id: string;
  name: string;
  category: string;
  therapeuticRange: string;
  therapeuticMin: number;
  therapeuticMax: number;
  toxicLevel: number;
  volumeOfDistribution: number;
  clearance: number;
  halfLife: number;
  bioavailability: number;
  unit: string;
  description: string;
  monitoringPoints: string[];
}

export interface TDMSimulationParams {
  drugId: string;
  dose: number;
  dosingInterval: number;
  administrationTime: number;
  sampleTime: number;
  infusionDuration: number;
  dosesGiven: number;
}

export interface TDMSimulationResult {
  predictedConcentration: number;
  interpretation: string;
  status: "subtherapeutic" | "therapeutic" | "toxic";
  statusColor: string;
  formula: string;
  derivation: string[];
  recommendations: string[];
}

export interface ClinicalExample {
  title: string;
  scenario: string;
  given: Record<string, number | string>;
  question: string;
  solution: string[];
  answer: string;
  learningPoint: string;
}

export type CalculatorType =
  | "pediatric-dose"
  | "creatinine-clearance"
  | "body-surface-area"
  | "dose-calculation"
  | "tdm-simulation";

export type ADRSeverity = "mild" | "moderate" | "severe" | "death";

export type CausalityAssessment = "definite" | "probable" | "possible" | "unlikely" | "conditional" | "unassessable";

export interface ADROption {
  isADR: boolean;
  suspectedDrugs: string[];
  severity: ADRSeverity;
  causality: CausalityAssessment;
  summary: string;
  naranjoScore?: number;
}

export interface ADRCase {
  id: string;
  title: string;
  patientInfo: {
    age: number;
    gender: "male" | "female";
    weight?: number;
    allergies?: string[];
    medicalHistory?: string[];
  };
  caseDescription: string;
  symptoms: string[];
  medicationsTaken: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    indication: string;
  }[];
  correctAnswer: ADROption;
  explanation: {
    isADRReason: string;
    suspectedDrugsReason: string;
    severityReason: string;
    causalityReason: string;
    summaryExample: string;
  };
  learningPoints: string[];
}

export interface ADRReportForm {
  reportId: string;
  reportDate: string;
  reporter: {
    name: string;
    profession: string;
    institution: string;
    contact: string;
  };
  patient: {
    initials: string;
    age: number;
    gender: "male" | "female";
    weight?: number;
    height?: number;
  };
  adverseReaction: {
    description: string;
    onsetDate: string;
    severity: ADRSeverity;
    outcome: string;
  };
  suspectedDrugs: {
    name: string;
    dose: string;
    route: string;
    startDate: string;
    endDate: string;
    indication: string;
  }[];
  causality: CausalityAssessment;
  narrative: string;
}

export type ConsultationStepType =
  | "identify"
  | "initial-therapy"
  | "adjustment"
  | "adr-management";

export interface ConsultationReference {
  title: string;
  type: "drug" | "chapter" | "interaction" | "calculator";
  targetId: string;
}

export interface ConsultationOption {
  id: string;
  label: string;
  description?: string;
  score: number;
  isOptimal?: boolean;
  feedback: string;
  references?: ConsultationReference[];
}

export interface ConsultationStep {
  id: string;
  type: ConsultationStepType;
  title: string;
  description: string;
  question: string;
  options: ConsultationOption[];
  expertExplanation: string;
  references?: ConsultationReference[];
}

export interface ConsultationVitalSign {
  name: string;
  value: string;
  status?: "normal" | "abnormal";
}

export interface ConsultationLabResult {
  test: string;
  value: string;
  reference: string;
  status?: "normal" | "abnormal";
}

export interface ConsultationPatientInfo {
  age: number;
  gender: "male" | "female";
  weight: number;
  height?: number;
  allergies: string[];
  medicalHistory: string[];
  currentMedications: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    indication: string;
  }[];
  vitalSigns: ConsultationVitalSign[];
  labResults: ConsultationLabResult[];
}

export interface ConsultationCase {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  chiefComplaint: string;
  presentIllness: string;
  patientInfo: ConsultationPatientInfo;
  steps: ConsultationStep[];
  finalSummary: string;
  learningPoints: string[];
  totalMaxScore: number;
}

export interface UserConsultationAnswer {
  stepId: string;
  selectedOptionId: string;
  score: number;
}

export interface TDMExercisePatient {
  age: number;
  gender: "male" | "female";
  weight: number;
  creatinineClearance?: number;
  medicalHistory: string[];
  currentMedications: string[];
}

export interface TDMExerciseCase {
  id: string;
  drugId: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  patient: TDMExercisePatient;
  currentDose: number;
  currentInterval: number;
  steadyStateConcentration: number;
  administrationRoute: "oral" | "iv";
  infusionDuration?: number;
  scenario: string;
  judgmentOptions: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  adjustmentOptions: {
    id: string;
    label: string;
    dose: number;
    interval: number;
    isOptimal: boolean;
    feedback: string;
  }[];
  expertAnalysis: string;
  learningPoints: string[];
}

export interface PKCurvePoint {
  time: number;
  concentration: number;
}

export interface PKCurveData {
  points: PKCurvePoint[];
  cmax: number;
  cmin: number;
  cssAvg: number;
  timeToSteadyState: number;
}

export type MindMapNodeType =
  | "root"
  | "category"
  | "mechanism"
  | "indication"
  | "adverseReaction"
  | "contraindication"
  | "interaction"
  | "dosage"
  | "pharmacokinetics"
  | "note";

export interface MindMapNode {
  id: string;
  name: string;
  type: MindMapNodeType;
  description?: string;
  parentId?: string;
  note?: string;
  children?: MindMapNode[];
}

export interface MindMapData {
  id: string;
  title: string;
  sourceType: "drug" | "chapter";
  sourceId: string;
  sourceName: string;
  rootNode: MindMapNode;
  createdAt: string;
  updatedAt: string;
}

export interface MindMapExportOptions {
  format: "png" | "pdf";
  includeNotes: boolean;
  quality?: number;
}

export interface GenerateMindMapParams {
  sourceType: "drug" | "chapter";
  sourceId: string;
}

export type CommentTag = "critical-analysis" | "clinical-application" | "methodology" | "question" | "insight";

export interface CommentReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByUser: boolean;
}

export interface JournalComment {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  researchQuestion: string;
  methodsConclusions: string;
  clinicalSignificance: string;
  myQuestions: string;
  tags: CommentTag[];
  createdAt: string;
  likes: number;
  likedByUser: boolean;
  replies: CommentReply[];
}

export interface JournalArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  abstract: string;
  keywords: string[];
  pdfUrl?: string;
  category: "classic" | "cutting-edge";
  weekNumber: number;
  yearOfWeek: number;
  summary?: string;
  keyFindings: string[];
  studyType: string;
  sampleSize?: number;
}

export type GameStageId = "target-discovery" | "lead-optimization" | "clinical-trial" | "regulatory-approval";
export type GameRarity = "common" | "rare" | "epic";
export type GameResult = "success" | "failed" | "in-progress";

export interface GameStage {
  id: GameStageId;
  name: string;
  description: string;
  order: number;
  baseSuccessRate: number;
  baseCost: number;
  baseTime: number;
  icon: string;
  color: string;
}

export interface GameDecisionOption {
  id: string;
  label: string;
  description: string;
  costModifier: number;
  timeModifier: number;
  successRateModifier: number;
  knowledgePopupId: string;
}

export interface GameDecision {
  id: string;
  stageId: GameStageId;
  title: string;
  description: string;
  options: GameDecisionOption[];
}

export interface GameKnowledgePopup {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface GameAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: string;
  rarity: GameRarity;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameHistory {
  id: string;
  date: string;
  result: GameResult;
  finalFunds: number;
  totalTime: number;
  finalSuccessRate: number;
  unlockedAchievementIds: string[];
  decisionsMade: string[];
  drugName: string;
  drugCategory: string;
}

export interface GameState {
  currentStage: GameStageId | null;
  currentDecisionIndex: number;
  funds: number;
  totalTime: number;
  currentSuccessRate: number;
  decisionsMade: string[];
  unlockedAchievements: string[];
  gameActive: boolean;
  drugName: string;
  drugCategory: string;
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
  notes: Note[];
  journalComments: JournalComment[];
  currentUserName: string;
  currentUserId: string;
  gameState: GameState;
  gameHistory: GameHistory[];
  gameAchievements: GameAchievement[];
  viewedKnowledgePopups: string[];
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
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  getArticleComments: (articleId: string) => JournalComment[];
  addJournalComment: (articleId: string, comment: Omit<JournalComment, "id" | "articleId" | "authorId" | "authorName" | "createdAt" | "likes" | "likedByUser" | "replies">) => JournalComment;
  likeJournalComment: (commentId: string) => void;
  replyToJournalComment: (commentId: string, content: string) => CommentReply;
  likeCommentReply: (commentId: string, replyId: string) => void;
  startGame: (drugName: string, drugCategory: string) => void;
  makeDecision: (optionId: string, costModifier: number, timeModifier: number, successRateModifier: number) => void;
  advanceStage: () => void;
  finishGame: (result: GameResult) => void;
  resetGame: () => void;
  unlockAchievement: (achievementId: string) => void;
  markKnowledgeViewed: (knowledgeId: string) => void;
  checkStageSuccess: () => boolean;
}
