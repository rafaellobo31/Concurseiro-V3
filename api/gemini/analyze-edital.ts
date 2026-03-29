import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.ts";

export default async function handler(req: any, res: any) {
  const { text } = req.body;
  const ai = getAI();

  if (!ai) {
    console.log("[Analyze-Edital] API Key missing. Falling back to mock.");
    return res.json({
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
  }

  try {
    const data = await withRetry(async () => {
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
        model: modelName,
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
      return JSON.parse(response.text);
    }, "analyze-edital");
    res.json({ success: true, data });
  } catch (error) {
    handleGeminiError(res, error, "analyze-edital");
  }
}
