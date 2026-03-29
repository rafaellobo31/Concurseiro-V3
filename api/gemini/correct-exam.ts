import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.ts";
import { buildCorrectionPrompt } from "../../src/prompts/correctionPrompt.ts";
import { generateMockCorrection } from "../../src/mocks/correctionMock.ts";

export default async function handler(req: any, res: any) {
  const { input } = req.body;
  const ai = getAI();

  if (!ai) {
    console.log("[Correct-Exam] API Key missing. Falling back to mock.");
    return res.json(generateMockCorrection(input));
  }

  try {
    const result = await withRetry(async () => {
      const prompt = buildCorrectionPrompt(input);
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
      return JSON.parse(response.text);
    }, "correct-exam");
    res.json(result);
  } catch (error) {
    handleGeminiError(res, error, "correct-exam", generateMockCorrection(input));
  }
}
