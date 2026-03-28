export interface EditalMateria {
  nome: string;
  topicos: string[];
}

export interface EditalPrioridade {
  materia: string;
  peso: string;
}

export interface EditalAnalysis {
  concurso: string;
  orgao: string;
  cargo: string;
  banca: string;
  escolaridade: string;
  materias: EditalMateria[];
  observacoes: string[];
  prioridades: EditalPrioridade[];
}

export interface EditalAnalysisResult {
  success: boolean;
  data?: EditalAnalysis;
  error?: string;
}
