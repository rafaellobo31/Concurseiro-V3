import { GoogleGenAI } from "@google/genai";
import { withRetry as aiRetry } from "../../src/utils/aiRetry.js";

export const modelName = "gemini-3-flash-preview";

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(`[Gemini-Shared] Checking GEMINI_API_KEY: ${apiKey ? 'Present (length: ' + apiKey.length + ')' : 'Missing'}`);
  
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.warn("[Gemini-Shared] API Key missing or placeholder.");
    return null;
  }
  
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err: any) {
    console.error("[Gemini-Shared] Error initializing GoogleGenAI:", err);
    return null;
  }
};

export async function withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
  console.log(`[Gemini-Shared] Executing ${context} with model ${modelName}`);
  return aiRetry(fn, {
    onRetry: (attempt, error) => {
      console.warn(`[Gemini-Shared] Retry attempt ${attempt} for ${context}. Error: ${error.message || error}`);
    }
  });
}

export function handleGeminiError(res: any, error: any, context: string, fallbackData?: any) {
  const errorMessage = error.message || String(error);
  const stack = error.stack || 'No stack trace available';
  
  console.error(`[Gemini-Shared] ERROR in ${context}:`, {
    message: errorMessage,
    stack: stack,
    errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error))
  });
  
  const isRetryable = String(error).toLowerCase().includes("503") || 
                     String(error).toLowerCase().includes("unavailable") ||
                     String(error).toLowerCase().includes("high demand") ||
                     String(error).toLowerCase().includes("429") ||
                     String(error).toLowerCase().includes("rate limit");

  if (fallbackData) {
    console.log(`[Gemini-Shared] Returning fallback data for ${context} due to error.`);
    return res.json(fallbackData);
  }

  res.status(isRetryable ? 503 : 500).json({
    error: true,
    message: `Erro em ${context}: ${errorMessage}`,
    details: stack,
    isRetryable
  });
}
