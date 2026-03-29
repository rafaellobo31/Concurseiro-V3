import { EditalAnalysisResult } from '../types/edital';

/**
 * Serviço para análise de editais usando IA.
 */
export const editalAnalysisService = {
  async analyzeEdital(text: string, onRetry?: (attempt: number) => void): Promise<EditalAnalysisResult> {
    const endpoint = '/api/gemini/analyze-edital';
    console.log(`[EditalAnalysisService] Chamada iniciada para ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.json() as EditalAnalysisResult;
      console.log(`[EditalAnalysisService] Sucesso na análise do edital`);
      return result;
    } catch (error: any) {
      console.error(`[EditalAnalysisService] Erro ao chamar backend para análise:`, error);
      console.log(`[EditalAnalysisService] Fallback acionado: Retornando erro amigável`);
      return {
        success: false,
        error: "Erro ao conectar com o servidor de análise. Tente novamente."
      };
    }
  },

  getMockAnalysis(): Promise<EditalAnalysisResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            concurso: "Concurso Mock (Chave API não configurada)",
            orgao: "Órgão Exemplo",
            cargo: "Cargo Exemplo",
            banca: "Banca Exemplo",
            escolaridade: "superior",
            materias: [
              { nome: "Matéria Exemplo 1", topicos: ["Tópico 1.1", "Tópico 1.2"] },
              { nome: "Matéria Exemplo 2", topicos: ["Tópico 2.1", "Tópico 2.2"] }
            ],
            observacoes: ["Configure sua chave Gemini para análise real"],
            prioridades: [
              { materia: "Matéria Exemplo 1", peso: "alto" }
            ]
          }
        });
      }, 1000);
    });
  }
};
