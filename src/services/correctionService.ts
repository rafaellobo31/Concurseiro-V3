import { CorrectionInput, CorrectionOutput } from '../types/correction';
import { generateMockCorrection } from '../mocks/correctionMock';

/**
 * Serviço para correção de simulados e análise de desempenho.
 */
export const correctionService = {
  /**
   * Corrige um simulado e gera análise de desempenho.
   * Tenta usar a API do Gemini se disponível, caso contrário usa dados mockados.
   */
  async correctExam(input: CorrectionInput, onRetry?: (attempt: number) => void): Promise<CorrectionOutput> {
    const endpoint = '/api/gemini/correct-exam';
    console.log(`[CorrectionService] Chamada iniciada para ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.json() as CorrectionOutput;
      console.log(`[CorrectionService] Sucesso na correção do simulado`);

      // Merge alternatives and metadata from input exam
      result.results = result.results.map(r => {
        const originalQuestion = input.exam.questoes.find(q => q.id === r.questionId);
        return {
          ...r,
          alternativas: originalQuestion?.alternativas,
          sourceMode: originalQuestion?.sourceMode,
          banca: originalQuestion?.banca,
          ano: originalQuestion?.ano,
          concursoReferencia: originalQuestion?.concursoReferencia
        };
      });
      
      return result;
    } catch (error: any) {
      console.error(`[CorrectionService] Erro ao chamar backend para correção:`, error);
      console.log(`[CorrectionService] Fallback acionado: Gerando correção mock`);
      return generateMockCorrection(input);
    }
  }
};
