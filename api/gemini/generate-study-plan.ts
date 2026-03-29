import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.ts";
import { STUDY_PLAN_SYSTEM_INSTRUCTION, getStudyPlanPrompt } from "../../src/services/studyPlanPrompt.ts";
import { generateMockStudyPlan } from "../../src/mocks/studyPlanMock.ts";

export default async function handler(req: any, res: any) {
  const { input } = req.body;
  const ai = getAI();

  if (!ai) {
    console.log("[Generate-Study-Plan] API Key missing. Falling back to mock.");
    return res.json(generateMockStudyPlan(input));
  }

  try {
    const result = await withRetry(async () => {
      const prompt = getStudyPlanPrompt(input);
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
      return JSON.parse(response.text);
    }, "generate-study-plan");
    res.json(result);
  } catch (error) {
    handleGeminiError(res, error, "generate-study-plan", generateMockStudyPlan(input));
  }
}
