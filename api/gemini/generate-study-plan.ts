import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.ts";
import { STUDY_PLAN_SYSTEM_INSTRUCTION, getStudyPlanPrompt } from "../../src/services/studyPlanPrompt.ts";
import { generateMockStudyPlan } from "../../src/mocks/studyPlanMock.ts";

export default async function handler(req: any, res: any) {
  console.log(`[Generate-Study-Plan] Início da requisição. Método: ${req.method}`);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: "Método não permitido" });
  }

  const { input } = req.body;
  console.log(`[Generate-Study-Plan] Payload recebido:`, JSON.stringify(input));

  if (!input) {
    return res.status(400).json({ error: true, message: "Payload 'input' ausente na requisição" });
  }

  const ai = getAI();

  if (!ai) {
    console.warn("[Generate-Study-Plan] API Key missing. Falling back to mock.");
    return res.json(generateMockStudyPlan(input));
  }

  try {
    const result = await withRetry(async () => {
      const prompt = getStudyPlanPrompt(input);
      console.log(`[Generate-Study-Plan] Prompt construído. Chamando Gemini...`);
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: STUDY_PLAN_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prioridades: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    materia: { type: Type.STRING },
                    nivelPrioridade: { type: Type.STRING, enum: ["Alta", "Média", "Baixa"] },
                    motivo: { type: Type.STRING }
                  },
                  required: ["materia", "nivelPrioridade", "motivo"]
                }
              },
              planoSemanal: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dia: { type: Type.STRING },
                    atividades: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          materia: { type: Type.STRING },
                          tempo: { type: Type.STRING },
                          tipo: { type: Type.STRING, enum: ["teoria", "revisão", "simulado"] }
                        },
                        required: ["materia", "tempo", "tipo"]
                      }
                    }
                  },
                  required: ["dia", "atividades"]
                }
              },
              recomendacoes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["prioridades", "planoSemanal", "recomendacoes"]
          }
        }
      });
      
      console.log(`[Generate-Study-Plan] Resposta recebida da Gemini.`);
      
      if (!response.text) {
        throw new Error("Resposta vazia da Gemini");
      }

      try {
        return JSON.parse(response.text);
      } catch (parseError: any) {
        console.error(`[Generate-Study-Plan] Erro ao parsear JSON da Gemini:`, response.text);
        throw new Error(`Erro de parsing JSON: ${parseError.message}`);
      }
    }, "generate-study-plan");
    
    console.log(`[Generate-Study-Plan] Sucesso na geração.`);
    res.json(result);
  } catch (error: any) {
    console.error(`[Generate-Study-Plan] Falha na geração:`, error);
    handleGeminiError(res, error, "generate-study-plan", generateMockStudyPlan(input));
  }
}
