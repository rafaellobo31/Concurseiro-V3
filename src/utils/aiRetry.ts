/**
 * Utility for retrying Gemini AI calls with exponential backoff.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  onRetry?: (attempt: number, error: any) => void;
}

/**
 * Checks if an error is a temporary Gemini API error that should be retried.
 */
export function isRetryableError(error: any): boolean {
  const errorMessage = String(error).toLowerCase();
  const errorStatus = error?.status || error?.code;

  return (
    errorMessage.includes("503") ||
    errorMessage.includes("unavailable") ||
    errorMessage.includes("high demand") ||
    errorMessage.includes("deadline exceeded") ||
    errorMessage.includes("rate limit") ||
    errorStatus === 503 ||
    errorStatus === 429 ||
    errorStatus === "UNAVAILABLE"
  );
}

/**
 * Executes a function with automatic retries for Gemini API errors.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 2,
    initialDelay = 2000,
    onRetry = (attempt, error) => {
      console.warn(`[AI-Retry] Tentativa ${attempt} falhou: ${error.message || error}. Tentando novamente...`);
    }
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (attempt <= maxRetries && isRetryableError(error)) {
        onRetry(attempt, error);
        // Exponential backoff: 2s, 4s...
        const delay = initialDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // If not retryable or max retries reached, throw
      throw error;
    }
  }

  throw lastError;
}
