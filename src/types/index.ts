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
  type: "drug" | "chapter" | "interaction";
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
