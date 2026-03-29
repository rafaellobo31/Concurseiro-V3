import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlanInput, StudyPlanOutput } from '../types/studyPlan';
import { generateMockStudyPlan } from '../mocks/studyPlanMock';
import { getStudyPlanPrompt, STUDY_PLAN_SYSTEM_INSTRUCTION } from './studyPlanPrompt';
import { withRetry } from '../utils/aiRetry';

/**
 * Generates a study plan. 
 * Uses Gemini AI if configured, otherwise falls back to a mock generator.
 */
export async function generateStudyPlan(input: StudyPlanInput, onRetry?: (attempt: number) => void): Promise<StudyPlanOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback to mock if API key is missing or looks like a placeholder
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.log('[StudyPlanService] Gemini API Key not configured or placeholder. Using mock study plan.');
    console.log('[StudyPlanService] API Key status:', apiKey ? `Placeholder (${apiKey.substring(0, 4)}...)` : 'Missing');
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockStudyPlan(input)), 1500);
    });
  }

  const modelName = "gemini-3-flash-preview";
  console.log(`[StudyPlanService] Starting study plan generation with model: ${modelName}`);
  console.log(`[StudyPlanService] API Key status: Present (starts with ${apiKey.substring(0, 4)}...)`);

  try {
    return await withRetry(async () => {
      const genAI = new GoogleGenAI({ apiKey });
      const model = modelName;
      const prompt = getStudyPlanPrompt(input);

      const response = await genAI.models.generateContent({
        model,
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
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      
      return JSON.parse(text) as StudyPlanOutput;
    }, {
      onRetry: (attempt, error) => {
        console.warn(`[StudyPlanService] Tentativa ${attempt} de plano de estudos falhou devido a alta demanda ou erro temporário. Tentando novamente...`);
        if (onRetry) onRetry(attempt);
      }
    });
  } catch (error: any) {
    console.error("[StudyPlanService] Error generating AI study plan after retries, falling back to mock:", error);
    const isHighDemand = String(error).toLowerCase().includes("high demand") || 
                         String(error).toLowerCase().includes("503") ||
                         String(error).toLowerCase().includes("unavailable");
    
    if (isHighDemand) {
      console.log("[StudyPlanService] Fallback acionado por alta demanda na API Gemini.");
    }
    
    return generateMockStudyPlan(input);
  }
}

// Keep the class for backward compatibility if needed, but use the function internally
export class StudyPlanService {
  static async generatePlan(input: StudyPlanInput, onRetry?: (attempt: number) => void): Promise<StudyPlanOutput> {
    return generateStudyPlan(input, onRetry);
  }
}
