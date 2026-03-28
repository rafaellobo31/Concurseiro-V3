import { CorrectionOutput } from './correction';

export interface SimuladoHistoryItem {
  id: string;
  createdAt: string;
  mode: 'por_concurso' | 'por_materia' | 'por_edital';
  tipoQuestao?: string;
  origemQuestoes?: string;
  concurso?: string;
  materia?: string;
  area?: string;
  banca?: string;
  quantidadeQuestoes: number;
  acertos: number;
  erros: number;
  percentual: number;
  nivelDesempenho: string;
  mensagemResumo: string;
  assuntosParaRevisao?: string[];
  examId?: string;
  correctionData?: CorrectionOutput;
}

export type HistoryStats = {
  totalSimulados: number;
  mediaAcertos: number;
  totalQuestoes: number;
  totalAcertos: number;
  melhorMateria?: string;
  piorMateria?: string;
};
