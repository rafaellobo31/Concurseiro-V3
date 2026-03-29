import { GoogleGenAI, Type } from "@google/genai";
import { EditalAnalysisResult } from '../types/edital';

/**
 * Serviço para análise de editais usando IA.
 */
export const editalAnalysisService = {
  async analyzeEdital(text: string): Promise<EditalAnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.warn('[EditalAnalysisService] Gemini API Key not configured or placeholder. Using mock analysis.');
      console.log('[EditalAnalysisService] API Key status:', apiKey ? `Placeholder (${apiKey.substring(0, 4)}...)` : 'Missing');
      return this.getMockAnalysis();
    }

    const modelName = "gemini-3-flash-preview";
    console.log(`[EditalAnalysisService] Starting analysis with model: ${modelName}`);
    console.log(`[EditalAnalysisService] API Key status: Present (starts with ${apiKey.substring(0, 4)}...)`);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = modelName;
      
      const prompt = `
        Analise o seguinte texto extraído de um edital de concurso público e extraia as informações estruturadas.
        
        INSTRUÇÃO CRÍTICA: O conteúdo programático (matérias e tópicos) geralmente está localizado no final do documento, em seções chamadas "CONTEÚDO PROGRAMÁTICO" ou em "ANEXOS" (ex: Anexo III). Vasculhe todo o texto para encontrar essas informações.
        
        Seja extremamente fiel ao conteúdo do edital fornecido. Não invente informações.
        Se encontrar o cargo mas não as matérias, procure novamente nos anexos.
        
        Texto do Edital:
        ${text.substring(0, 500000)} 
        
        Extraia:
        1. Nome do Concurso
        2. Órgão
        3. Cargo/Área principal
        4. Banca examinadora
        5. Nível de escolaridade exigido
        6. Lista de matérias do conteúdo programático (cada matéria com seus principais tópicos)
        7. Observações estratégicas (dicas baseadas no edital)
        8. Prioridades de estudo (quais matérias parecem ter mais peso ou importância)
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "Você é um especialista em análise de editais de concursos públicos. Sua tarefa é extrair informações precisas e estruturadas do texto fornecido. Retorne APENAS o JSON solicitado.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              concurso: { type: Type.STRING },
              orgao: { type: Type.STRING },
              cargo: { type: Type.STRING },
              banca: { type: Type.STRING },
              escolaridade: { type: Type.STRING },
              materias: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nome: { type: Type.STRING },
                    topicos: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["nome", "topicos"]
                }
              },
              observacoes: { type: Type.ARRAY, items: { type: Type.STRING } },
              prioridades: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    materia: { type: Type.STRING },
                    peso: { type: Type.STRING, enum: ["baixo", "médio", "alto"] }
                  },
                  required: ["materia", "peso"]
                }
              }
            },
            required: ["concurso", "orgao", "cargo", "banca", "escolaridade", "materias"]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) throw new Error("Resposta vazia da IA");
      
      const data = JSON.parse(resultText);
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error("Error analyzing edital with AI:", error);
      return {
        success: false,
        error: "Não foi possível analisar o edital. Tente novamente ou verifique se o arquivo contém o conteúdo programático."
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
