import { SimuladoHistoryItem } from './history';

export interface DashboardMetrics {
  totalSimulados: number;
  mediaPercentual: number;
  melhorPercentual: number;
  piorPercentual: number;
  ultimoPercentual: number;
  totalQuestoesRespondidas: number;
  totalAcertos: number;
  totalErros: number;
  atividadeRecente: SimuladoHistoryItem[];
  tendenciaRecente: 'melhora' | 'estabilidade' | 'queda';
  analisePorMateria: {
    melhor: { nome: string; percentual: number } | null;
    pior: { nome: string; percentual: number } | null;
  };
  analisePorConcurso: {
    melhor: { nome: string; percentual: number } | null;
    pior: { nome: string; percentual: number } | null;
  };
  insights: {
    pontosFortes: string[];
    pontosFracos: string[];
    recomendacoes: string[];
  };
}
