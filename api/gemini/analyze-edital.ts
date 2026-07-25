import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.js";

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  console.log(`[Analyze-Edital] Início da função. Método: ${req.method}`);
  
  if (req.method !== 'POST') {
    console.warn(`[Analyze-Edital] Método não permitido: ${req.method}`);
    return res.status(405).json({
      success: false,
      code: "METHOD_NOT_ALLOWED",
      message: "Método não permitido"
    });
  }

  const { text } = req.body || {};
  const textLength = text ? text.length : 0;
  console.log(`[Analyze-Edital] Tamanho do texto recebido: ${textLength} caracteres`);

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn("[Analyze-Edital] Texto do edital ausente ou inválido.");
    return res.status(400).json({
      success: false,
      code: "INVALID_INPUT",
      message: "Texto do edital ausente na requisição"
    });
  }

  const apiKeyPresent = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';
  console.log(`[Analyze-Edital] Presença da GEMINI_API_KEY: ${apiKeyPresent ? 'Sim' : 'Não'}`);
  console.log(`[Analyze-Edital] Modelo utilizado: ${modelName}`);

  const ai = getAI();

  if (!ai) {
    console.warn("[Analyze-Edital] API Key missing ou inválida. Retornando mock de análise.");
    return res.json({
      success: true,
      data: {
        concurso: "Concurso Exemplo (Modo Demonstração)",
        orgao: "Órgão Exemplo",
        cargo: "Cargo Exemplo",
        banca: "Banca Exemplo",
        escolaridade: "superior",
        materias: [
          { nome: "Língua Portuguesa", topicos: ["Compreensão e interpretação de textos", "Gramática"] },
          { nome: "Raciocínio Lógico", topicos: ["Lógica proposicional", "Problemas de contagem"] },
          { nome: "Conhecimentos Específicos", topicos: ["Legislação aplicada", "Direito Administrativo"] }
        ],
        observacoes: ["Chave API não configurada ou em ambiente de demonstração."],
        prioridades: [
          { materia: "Conhecimentos Específicos", peso: "alto" },
          { materia: "Língua Portuguesa", peso: "médio" }
        ]
      }
    });
  }

  // Otimização de tamanho do texto: Se o PDF for muito extenso, selecionar as partes cruciais
  // O conteúdo programático geralmente fica nos anexos finais, e o cabeçalho no início.
  let processedText = text;
  const MAX_CHAR_LIMIT = 100000;
  if (textLength > MAX_CHAR_LIMIT) {
    const head = text.substring(0, 45000);
    const tail = text.substring(textLength - 50000);
    processedText = `${head}\n\n[...TRECHO INTERMEDIÁRIO DO EDITAL OMITIDO PARA OTIMIZAÇÃO DE PERFORMANCE...]\n\n${tail}`;
    console.log(`[Analyze-Edital] Texto truncado de ${textLength} para ${processedText.length} caracteres para evitar estouro de contexto/timeout.`);
  }

  try {
    const data = await withRetry(async () => {
      const prompt = `
        Analise o seguinte texto extraído de um edital de concurso público e extraia as informações estruturadas.
        
        INSTRUÇÃO CRÍTICA: O conteúdo programático (matérias e tópicos) geralmente está localizado no final do documento, em seções chamadas "CONTEÚDO PROGRAMÁTICO" ou em "ANEXOS" (ex: Anexo III). Vasculhe todo o texto para encontrar essas informações.
        
        Seja extremamente fiel ao conteúdo do edital fornecido. Não invente informações.
        Se encontrar o cargo mas não as matérias, procure novamente nos anexos.
        
        Texto do Edital:
        ${processedText} 
        
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

      console.log(`[Analyze-Edital] Início da chamada Gemini (generateContent)...`);
      
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
      
      const responseTime = Date.now() - startTime;
      console.log(`[Analyze-Edital] Resposta recebida da Gemini em ${responseTime}ms.`);
      
      if (!response.text) {
        console.error("[Analyze-Edital] Resposta bruta da Gemini está vazia ou indefinida.");
        throw new Error("Resposta vazia da Gemini");
      }

      const rawPreview = response.text.substring(0, 200);
      console.log(`[Analyze-Edital] Texto bruto retornado (primeiros 200 chars): ${rawPreview}`);

      try {
        const parsedJSON = JSON.parse(response.text);
        console.log(`[Analyze-Edital] Sucesso ao parsear JSON da resposta.`);
        return parsedJSON;
      } catch (parseError: any) {
        console.error(`[Analyze-Edital] Erro de parsing JSON ao processar resposta: ${parseError.message}`);
        console.error(`[Analyze-Edital] Texto completo não parseável:`, response.text);
        throw new Error(`Erro de parsing JSON: ${parseError.message}`);
      }
    }, "analyze-edital");
    
    console.log(`[Analyze-Edital] Sucesso total na análise. Tempo decorrido: ${Date.now() - startTime}ms.`);
    return res.json({ success: true, data });
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    const stack = error.stack || 'Sem stack trace';
    const status = error.status || error.code || 500;

    console.error(`[Analyze-Edital] Erro completo na análise:`, {
      message: errorMsg,
      status,
      stack,
    });

    handleGeminiError(res, error, "analyze-edital");
  }
}
