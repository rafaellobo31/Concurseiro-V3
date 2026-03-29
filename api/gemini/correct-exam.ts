import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.js";
import { buildCorrectionPrompt } from "../../src/prompts/correctionPrompt.js";
import { generateMockCorrection } from "../../src/mocks/correctionMock.js";

export default async function handler(req: any, res: any) {
  console.log(`[Correct-Exam] Início da requisição. Método: ${req.method}`);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: "Método não permitido" });
  }

  const { input } = req.body;
  console.log(`[Correct-Exam] Payload recebido:`, JSON.stringify(input));

  if (!input) {
    return res.status(400).json({ error: true, message: "Payload 'input' ausente na requisição" });
  }

  const ai = getAI();

  if (!ai) {
    console.warn("[Correct-Exam] API Key missing. Falling back to mock.");
    return res.json(generateMockCorrection(input));
  }

  try {
    const result = await withRetry(async () => {
      const prompt = buildCorrectionPrompt(input);
      console.log(`[Correct-Exam] Prompt construído. Chamando Gemini...`);
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.OBJECT,
                properties: {
                  totalQuestions: { type: Type.NUMBER },
                  correctAnswers: { type: Type.NUMBER },
                  incorrectAnswers: { type: Type.NUMBER },
                  score: { type: Type.NUMBER },
                  performanceLevel: { type: Type.STRING },
                  timeSpent: { type: Type.NUMBER }
                },
                required: ["totalQuestions", "correctAnswers", "score", "performanceLevel", "timeSpent"]
              },
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionId: { type: Type.NUMBER },
                    enunciado: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN },
                    userAnswer: { type: Type.STRING },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    assunto: { type: Type.STRING },
                    feedback: { type: Type.STRING }
                  },
                  required: ["questionId", "isCorrect", "userAnswer", "correctAnswer", "explanation", "assunto", "feedback"]
                }
              },
              analysis: {
                type: Type.OBJECT,
                properties: {
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["strengths", "weaknesses", "recommendations"]
              }
            },
            required: ["summary", "results", "analysis"]
          }
        }
      });
      
      console.log(`[Correct-Exam] Resposta recebida da Gemini.`);
      
      if (!response.text) {
        throw new Error("Resposta vazia da Gemini");
      }

      try {
        return JSON.parse(response.text);
      } catch (parseError: any) {
        console.error(`[Correct-Exam] Erro ao parsear JSON da Gemini:`, response.text);
        throw new Error(`Erro de parsing JSON: ${parseError.message}`);
      }
    }, "correct-exam");
    
    console.log(`[Correct-Exam] Sucesso na correção.`);
    res.json(result);
  } catch (error: any) {
    console.error(`[Correct-Exam] Falha na correção:`, error);
    handleGeminiError(res, error, "correct-exam", generateMockCorrection(input));
  }
}
