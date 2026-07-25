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

      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.success) {
        const errorMsg = json?.message || json?.details || `Erro na análise do edital (${response.status})`;
        const errorCode = json?.code || 'AI_UNAVAILABLE';
        console.error(`[EditalAnalysisService] Resposta de erro do backend (${response.status}):`, errorMsg);
        
        return {
          success: false,
          code: errorCode,
          error: errorMsg
        };
      }

      console.log(`[EditalAnalysisService] Sucesso na análise do edital`);
      return {
        success: true,
        data: json.data
      };
    } catch (error: any) {
      console.error(`[EditalAnalysisService] Erro de conexão ao chamar backend para análise:`, error);
      return {
        success: false,
        code: 'NETWORK_ERROR',
        error: "Não foi possível conectar ao servidor de análise. Verifique sua conexão e tente novamente."
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
