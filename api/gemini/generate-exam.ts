import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.ts";
import { EXAM_SYSTEM_INSTRUCTION, buildExamPrompt } from "../../src/prompts/examPrompt.ts";
import { generateMockExam } from "../../src/mocks/examMock.ts";

export default async function handler(req: any, res: any) {
  const { input } = req.body;
  const ai = getAI();

  if (!ai) {
    console.log("[Generate-Exam] API Key missing. Falling back to mock.");
    return res.json(generateMockExam(input));
  }

  try {
    const result = await withRetry(async () => {
      const prompt = buildExamPrompt(input);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: EXAM_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tituloSimulado: { type: Type.STRING },
              descricao: { type: Type.STRING },
              modo: { type: Type.STRING },
              concurso: { type: Type.STRING },
              orgao: { type: Type.STRING },
              cargo: { type: Type.STRING },
              nivelEscolaridade: { type: Type.STRING },
              materia: { type: Type.STRING },
              banca: { type: Type.STRING },
              nivel: { type: Type.STRING },
              tipoQuestao: { type: Type.STRING },
              questoes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    enunciado: { type: Type.STRING },
                    tipo: { type: Type.STRING },
                    banca: { type: Type.STRING },
                    ano: { type: Type.INTEGER },
                    concursoReferencia: { type: Type.STRING },
                    assunto: { type: Type.STRING },
                    peso: { type: Type.STRING },
                    alternativas: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          letra: { type: Type.STRING },
                          texto: { type: Type.STRING }
                        },
                        required: ["letra", "texto"]
                      }
                    },
                    afirmativas: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.INTEGER },
                          texto: { type: Type.STRING },
                          correta: { type: Type.BOOLEAN }
                        },
                        required: ["id", "texto", "correta"]
                      }
                    },
                    correta: { type: Type.STRING },
                    explicacao: { type: Type.STRING }
                  },
                  required: ["id", "enunciado", "tipo", "explicacao", "assunto", "peso", "banca", "ano", "concursoReferencia"]
                }
              }
            },
            required: ["tituloSimulado", "descricao", "questoes"]
          }
        }
      });
      return JSON.parse(response.text);
    }, "generate-exam");
    res.json(result);
  } catch (error) {
    handleGeminiError(res, error, "generate-exam", generateMockExam(input));
  }
}
