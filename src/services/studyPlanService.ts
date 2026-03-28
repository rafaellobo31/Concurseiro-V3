import { GoogleGenAI, Type } from "@google/genai";
import { StudyPlanInput, StudyPlanOutput } from '../types/studyPlan';
import { generateMockStudyPlan } from '../mocks/studyPlanMock';
import { getStudyPlanPrompt, STUDY_PLAN_SYSTEM_INSTRUCTION } from './studyPlanPrompt';

/**
 * Generates a study plan. 
 * Uses Gemini AI if configured, otherwise falls back to a mock generator.
 */
export async function generateStudyPlan(input: StudyPlanInput): Promise<StudyPlanOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback to mock if API key is missing or looks like a placeholder
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.log('Gemini API Key not configured. Using mock study plan.');
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockStudyPlan(input)), 1500);
    });
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const model = "gemini-3.1-pro-preview";
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
  } catch (error) {
    console.error("Error generating AI study plan, falling back to mock:", error);
    return generateMockStudyPlan(input);
  }
}

// Keep the class for backward compatibility if needed, but use the function internally
export class StudyPlanService {
  static async generatePlan(input: StudyPlanInput): Promise<StudyPlanOutput> {
    return generateStudyPlan(input);
  }
}
