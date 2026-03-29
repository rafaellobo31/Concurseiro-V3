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
    console.log(`[CorrectionService] Requesting correction from backend...`);

    try {
      const response = await fetch('/api/gemini/correct-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.json() as CorrectionOutput;

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
      console.error("[CorrectionService] Error calling backend for correction:", error);
      return generateMockCorrection(input);
    }
  }
};
