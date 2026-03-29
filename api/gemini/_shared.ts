import { GoogleGenAI } from "@google/genai";
import { withRetry as aiRetry } from "../../src/utils/aiRetry.ts";

export const modelName = "gemini-3-flash-preview";

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.warn("[Gemini-Shared] API Key missing or placeholder.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
  console.log(`[Gemini-Shared] Executing ${context} with model ${modelName}`);
  return aiRetry(fn, {
    onRetry: (attempt) => {
      console.warn(`[Gemini-Shared] Retry attempt ${attempt} for ${context}`);
    }
  });
}

export function handleGeminiError(res: any, error: any, context: string, fallbackData?: any) {
  console.error(`[Gemini-Shared] Error in ${context}:`, error);
  
  const isRetryable = String(error).toLowerCase().includes("503") || 
                     String(error).toLowerCase().includes("unavailable") ||
                     String(error).toLowerCase().includes("high demand");

  if (fallbackData) {
    console.log(`[Gemini-Shared] Returning fallback data for ${context}`);
    return res.json(fallbackData);
  }

  res.status(isRetryable ? 503 : 500).json({
    success: false,
    error: `Erro em ${context}: ${error.message || 'Erro desconhecido'}`,
    isRetryable
  });
}
