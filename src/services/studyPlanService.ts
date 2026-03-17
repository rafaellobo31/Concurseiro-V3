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
            resumoEstrategico: {
              type: Type.OBJECT,
              properties: {
                titulo: { type: Type.STRING },
                descricao: { type: Type.STRING }
              },
              required: ["titulo", "descricao"]
            },
            cargaSemanal: {
              type: Type.OBJECT,
              properties: {
                horasTotais: { type: Type.NUMBER },
                descricao: { type: Type.STRING },
                divisao: {
                  type: Type.OBJECT,
                  properties: {
                    teoria: { type: Type.STRING },
                    questoes: { type: Type.STRING },
                    revisao: { type: Type.STRING }
                  },
                  required: ["teoria", "questoes", "revisao"]
                }
              },
              required: ["horasTotais", "descricao", "divisao"]
            },
            gradeSemanal: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dia: { type: Type.STRING },
                  blocos: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        materia: { type: Type.STRING },
                        duracao: { type: Type.STRING },
                        foco: { type: Type.STRING }
                      },
                      required: ["materia", "duracao", "foco"]
                    }
                  }
                },
                required: ["dia", "blocos"]
              }
            },
            materiasPrioritarias: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  peso: { type: Type.STRING, enum: ["baixo", "médio", "alto"] },
                  justificativa: { type: Type.STRING }
                },
                required: ["nome", "peso", "justificativa"]
              }
            },
            termometroQuestoes: {
              type: Type.OBJECT,
              properties: {
                intensidade: { type: Type.STRING, enum: ["baixa", "moderada", "alta", "intensa"] },
                metaSemanal: { type: Type.STRING },
                justificativa: { type: Type.STRING }
              },
              required: ["intensidade", "metaSemanal", "justificativa"]
            },
            assuntosPrincipais: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  materia: { type: Type.STRING },
                  topicos: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["materia", "topicos"]
              }
            },
            estrategiaBanca: {
              type: Type.OBJECT,
              properties: {
                banca: { type: Type.STRING },
                perfil: { type: Type.STRING },
                metodologia: { type: Type.STRING }
              },
              required: ["banca", "perfil", "metodologia"]
            },
            cicloRevisao: {
              type: Type.OBJECT,
              properties: {
                curta: { type: Type.STRING },
                semanal: { type: Type.STRING },
                acumulada: { type: Type.STRING }
              },
              required: ["curta", "semanal", "acumulada"]
            },
            orientacaoFinal: {
              type: Type.OBJECT,
              properties: {
                mensagem: { type: Type.STRING },
                errosEvitar: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["mensagem", "errosEvitar"]
            }
          },
          required: [
            "resumoEstrategico", "cargaSemanal", "gradeSemanal", 
            "materiasPrioritarias", "termometroQuestoes", "assuntosPrincipais", 
            "estrategiaBanca", "cicloRevisao", "orientacaoFinal"
          ]
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
