export type User = {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  avatarUrl?: string;
  plan?: 'free' | 'pro';
  stripe_customer_id?: string;
  createdAt?: string;
};

export type Alternative = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  text: string;
  subject: string;
  alternatives: Alternative[];
  explanation?: string;
};

export type Exam = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
};

export type ExamResult = {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: string;
};

export type StudyPlanInput = {
  concurso: string;
  hoursPerDay: string;
  daysPerWeek: string;
  timeUntilExam: string;
};

export type StrategicSummary = {
  scenarioAnalysis: string;
  urgencyLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  generalRecommendation: string;
};

export type WeeklySchedule = {
  totalHours: number;
  distribution: {
    day: string;
    subjects: { name: string; duration: string }[];
  }[];
  reviewGuidance: string;
};

export type PrioritySubject = {
  name: string;
  strategicWeight: number; // 1-10
  justification: string;
};

export type QuestionThermometer = {
  intensity: 'Baixa' | 'Moderada' | 'Alta' | 'Intensa';
  idealVolume: string;
  justification: string;
};

export type BankStrategy = {
  name: string;
  methodology: string;
  chargingProfile: string;
  questionStyle: string;
  suggestedApproach: string;
};

export type ReviewCycle = {
  shortReview: string;
  weeklyReview: string;
  accumulatedReview: string;
  practicalSuggestion: string;
};

export type MainTopic = {
  subject: string;
  topics: string[];
  initialFocus: string;
  incidenceHighlight: string;
};

export type PerformanceOrientation = {
  whatToAvoid: string[];
  howToMaintainConsistency: string;
  finalRecommendation: string;
};

export type StudyPlan = {
  id: string;
  userId: string;
  input: StudyPlanInput;
  summary: StrategicSummary;
  schedule: WeeklySchedule;
  priorities: PrioritySubject[];
  thermometer: QuestionThermometer;
  bankStrategy: BankStrategy;
  reviewCycle: ReviewCycle;
  mainTopics: MainTopic[];
  performance: PerformanceOrientation;
  createdAt: string;
};
