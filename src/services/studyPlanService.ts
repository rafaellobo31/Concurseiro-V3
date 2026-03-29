import { StudyPlanInput, StudyPlanOutput } from '../types/studyPlan';
import { generateMockStudyPlan } from '../mocks/studyPlanMock';

/**
 * Generates a study plan. 
 * Uses Gemini AI if configured, otherwise falls back to a mock generator.
 */
export async function generateStudyPlan(input: StudyPlanInput, onRetry?: (attempt: number) => void): Promise<StudyPlanOutput> {
  const endpoint = '/api/gemini/generate-study-plan';
  console.log(`[StudyPlanService] Chamada iniciada para ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const result = await response.json() as StudyPlanOutput;
    console.log(`[StudyPlanService] Sucesso na geração do plano de estudos`);
    return result;
  } catch (error: any) {
    console.error(`[StudyPlanService] Erro ao chamar backend para plano de estudos:`, error);
    console.log(`[StudyPlanService] Fallback acionado: Gerando plano de estudos mock`);
    return generateMockStudyPlan(input);
  }
}

// Keep the class for backward compatibility if needed, but use the function internally
export class StudyPlanService {
  static async generatePlan(input: StudyPlanInput, onRetry?: (attempt: number) => void): Promise<StudyPlanOutput> {
    return generateStudyPlan(input, onRetry);
  }
}
