export type SimulatorInput = {
  modoSimulado: 'concurso' | 'materia';
  concurso?: string;
  cargo?: string;
  materia?: string;
  banca?: string;
  tipoQuestao: 'multipla_escolha' | 'verdadeiro_falso';
  quantidade: number;
  nivel: 'facil' | 'medio' | 'dificil';
};

export type MultipleChoiceAlternative = {
  letra: string;
  texto: string;
};

export type TrueFalseAffirmative = {
  id: number;
  texto: string;
  correta: boolean;
};

export type Question = {
  id: number;
  enunciado: string;
  tipo: 'multipla_escolha' | 'verdadeiro_falso';
  alternativas?: MultipleChoiceAlternative[];
  afirmativas?: TrueFalseAffirmative[];
  correta?: string; // For multiple choice
  explicacao: string;
  assunto: string;
  peso: 'baixo' | 'medio' | 'alto';
  // Metadados para questões baseadas em provas anteriores
  sourceMode?: 'ai_generated' | 'previous_exam_based';
  banca?: string;
  ano?: number;
  concursoReferencia?: string;
};

export type SimulatorOutput = {
  tituloSimulado: string;
  descricao: string;
  modo: string;
  concurso: string;
  cargo?: string;
  materia: string;
  banca: string;
  nivel: string;
  tipoQuestao: string;
  questoes: Question[];
};
