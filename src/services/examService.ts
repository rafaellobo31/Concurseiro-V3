import { ExamInput, ExamOutput } from '../types/exam';
import { generateMockExam } from '../mocks/examMock';
import { validateAndCleanQuestions } from '../utils/examUtils';
import { MOCK_EXAMS, MOCK_RESULTS } from '../mocks/data';
import { Exam, ExamResult } from '../types';

/**
 * Serviço para gerenciamento de simulados.
 */
export const examService = {
  /**
   * Retorna todos os simulados disponíveis.
   */
  async getExams(): Promise<Exam[]> {
    return MOCK_EXAMS;
  },

  /**
   * Retorna um simulado específico pelo ID.
   */
  async getExamById(id: string): Promise<Exam | null> {
    return MOCK_EXAMS.find(e => e.id === id) || null;
  },

  /**
   * Retorna os resultados de um usuário.
   */
  async getUserResults(userId: string): Promise<ExamResult[]> {
    return MOCK_RESULTS.filter(r => r.userId === userId);
  },

  /**
   * Salva o resultado de um simulado.
   */
  async saveResult(result: Omit<ExamResult, 'id' | 'completedAt'>): Promise<ExamResult> {
    const newResult: ExamResult = {
      ...result,
      id: `res-${Math.random().toString(36).substr(2, 9)}`,
      completedAt: new Date().toISOString(),
    };
    MOCK_RESULTS.push(newResult);
    return newResult;
  },

  /**
   * Função principal para gerar simulados via IA.
   * Tenta usar a API do Gemini se disponível, caso contrário usa dados mockados.
   */
  async generateExam(input: ExamInput, onRetry?: (attempt: number) => void): Promise<ExamOutput> {
    const endpoint = '/api/gemini/generate-exam';
    console.log(`[ExamService] Chamada iniciada para ${endpoint}`);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.json() as ExamOutput;
      console.log(`[ExamService] Sucesso na geração do simulado`);
      
      // Camada de validação e limpeza para garantir aderência ao cargo
      result.questoes = validateAndCleanQuestions(result.questoes, input);

      // Garantir que cada questão tenha o sourceMode correto
      result.questoes = result.questoes.map(q => ({
        ...q,
        sourceMode: 'previous_exam_based'
      }));

      return result;
    } catch (error: any) {
      console.error(`[ExamService] Erro ao chamar backend para geração:`, error);
      console.log(`[ExamService] Fallback acionado: Gerando simulado mock`);
      return generateMockExam(input);
    }
  }
};
