import { StudyPlanInput, StudyPlanOutput } from '../types/studyPlan';
import { generateMockStudyPlan } from '../mocks/studyPlanMock';

/**
 * Generates a study plan. 
 * Uses Gemini AI if configured, otherwise falls back to a mock generator.
 */
export async function generateStudyPlan(input: StudyPlanInput, onRetry?: (attempt: number) => void): Promise<StudyPlanOutput> {
  console.log(`[StudyPlanService] Requesting study plan from backend...`);

  try {
    const response = await fetch('/api/gemini/generate-study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    return await response.json() as StudyPlanOutput;
  } catch (error: any) {
    console.error("[StudyPlanService] Error calling backend for study plan:", error);
    return generateMockStudyPlan(input);
  }
}

// Keep the class for backward compatibility if needed, but use the function internally
export class StudyPlanService {
  static async generatePlan(input: StudyPlanInput, onRetry?: (attempt: number) => void): Promise<StudyPlanOutput> {
    return generateStudyPlan(input, onRetry);
  }
}
