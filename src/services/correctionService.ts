import { GoogleGenAI, Type } from "@google/genai";
import { CorrectionInput, CorrectionOutput } from '../types/correction';
import { buildCorrectionPrompt } from '../prompts/correctionPrompt';
import { generateMockCorrection } from '../mocks/correctionMock';

/**
 * Serviço para correção de simulados e análise de desempenho.
 */
export const correctionService = {
  /**
   * Corrige um simulado e gera análise de desempenho.
   * Tenta usar a API do Gemini se disponível, caso contrário usa dados mockados.
   */
  async correctExam(input: CorrectionInput): Promise<CorrectionOutput> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Verifica se a chave da API está configurada
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.log('[CorrectionService] Gemini API Key not configured or placeholder. Using mock correction.');
      console.log('[CorrectionService] API Key status:', apiKey ? `Placeholder (${apiKey.substring(0, 4)}...)` : 'Missing');
      return generateMockCorrection(input);
    }

    const modelName = "gemini-3-flash-preview";
    console.log(`[CorrectionService] Starting correction with model: ${modelName}`);
    console.log(`[CorrectionService] API Key status: Present (starts with ${apiKey.substring(0, 4)}...)`);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = modelName;
      const prompt = buildCorrectionPrompt(input);

      const response = await ai.models.generateContent({
        model,
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

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      
      const result = JSON.parse(text) as CorrectionOutput;

      console.log('[CorrectionService] AI correction successful.');

      // Merge alternatives and metadata from input exam
      result.results = result.results.map(r => {
        const originalQuestion = input.exam.questoes.find(q => q.id === r.questionId);
        return {
          ...r,
          alternativas: originalQuestion?.alternativas,
          sourceMode: originalQuestion?.sourceMode,
          banca: originalQuestion?.banca,
          ano: originalQuestion?.ano,
          concursoReferencia: originalQuestion?.concursoReferencia
        };
      });
      
      return result;
    } catch (error) {
      console.error("Error generating AI correction, falling back to mock:", error);
      return generateMockCorrection(input);
    }
  }
};
