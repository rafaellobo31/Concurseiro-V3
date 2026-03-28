import { ExamOutput, ExamQuestion } from './exam';
import { CorrectionOutput, UserAnswer } from './correction';

export interface DBExam {
  id?: string;
  user_id: string;
  created_at?: string;
  mode: string;
  origem_questoes: string;
  concurso?: string;
  materia?: string;
  area?: string;
  banca?: string;
  quantidade_questoes: number;
  acertos: number;
  erros: number;
  percentual: number;
}

export interface DBExamQuestion {
  id?: string;
  exam_id: string;
  ordem: number;
  enunciado: string;
  tipo: string;
  alternativas?: any;
  correta: string;
  explicacao: string;
  ponto_revisao?: string;
  assunto: string;
  banca?: string;
  ano?: number;
  concurso_referencia?: string;
  cargo_referencia?: string;
}

export interface DBExamAnswer {
  id?: string;
  exam_id: string;
  exam_question_id: string; // ID da questão no banco (exam_questions.id)
  resposta_usuario?: string;
  respostas_usuario?: any;
  acertou: boolean;
}

export interface FullExamPersistencePayload {
  exam: ExamOutput;
  correction: CorrectionOutput;
  userAnswers: UserAnswer[];
}
