import { ExamOutput } from './exam';

export interface UserAnswer {
  questionId: number;
  selectedOption?: string; // Para múltipla escolha (ex: 'A')
  statements?: { id: number; answer: boolean }[]; // Para verdadeiro/falso
}

export interface CorrectionInput {
  exam: ExamOutput;
  answers: UserAnswer[];
  timeSpent: number; // em segundos
}

export interface QuestionCorrectionResult {
  questionId: number;
  enunciado: string;
  isCorrect: boolean;
  userAnswer: string; // Representação amigável da resposta do usuário
  correctAnswer: string; // Representação amigável da resposta correta
  explanation: string;
  assunto: string;
  feedback: string; // Feedback da IA sobre o erro ou acerto
  // Metadados para questões baseadas em provas anteriores
  sourceMode?: 'ai_generated' | 'previous_exam_based' | 'edital_based';
  banca?: string;
  ano?: number;
  concursoReferencia?: string;
}

export interface CorrectionSummary {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number; // 0 a 100
  performanceLevel: 'Excelente' | 'Bom' | 'Regular' | 'Insuficiente' | 'Crítico';
  timeSpent: number;
}

export interface FinalPerformanceAnalysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface CorrectionOutput {
  summary: CorrectionSummary;
  results: QuestionCorrectionResult[];
  analysis: FinalPerformanceAnalysis;
}
