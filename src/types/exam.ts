export type ExamInput = {
  modo: 'concurso' | 'materia';
  concurso?: string;
  orgao?: string;
  cargo?: string;
  materia?: string;
  banca?: string;
  tipoQuestao: 'multipla_escolha' | 'verdadeiro_falso';
  quantidade: number;
  nivel: 'facil' | 'medio' | 'dificil';
  nivelEscolaridade?: string;
};

export type ExamAlternative = {
  letra: string;
  texto: string;
};

export type TrueFalseStatement = {
  id: number;
  texto: string;
  correta: boolean;
};

export type ExamQuestion = {
  id: number;
  enunciado: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso';
  alternativas?: ExamAlternative[];
  afirmativas?: TrueFalseStatement[];
  correta?: string; // Para múltipla escolha (ex: 'A')
  explicacao: string;
  assunto: string;
  peso: 'baixo' | 'medio' | 'alto';
  // Metadados para questões baseadas em provas anteriores
  sourceMode?: 'ai_generated' | 'previous_exam_based';
  banca?: string;
  ano?: number;
  concursoReferencia?: string;
};

export type ExamOutput = {
  tituloSimulado: string;
  descricao: string;
  modo: string;
  concurso: string;
  orgao?: string;
  cargo?: string;
  materia: string;
  banca: string;
  nivel: string;
  nivelEscolaridade?: string;
  tipoQuestao: string;
  questoes: ExamQuestion[];
};
