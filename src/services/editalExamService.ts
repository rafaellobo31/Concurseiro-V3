import { EditalAnalysis } from '../types/edital';
import { ExamOutput, ExamInput } from '../types/exam';
import { generateMockExam } from '../mocks/examMock';
import { validateAndCleanQuestions } from '../utils/examUtils';

export const editalExamService = {
  /**
   * Gera um simulado baseado na análise estruturada do edital.
   */
  async generateEditalExam(analysis: EditalAnalysis, quantidade: number = 10, selectedSubjects?: string[], onRetry?: (attempt: number) => void): Promise<ExamOutput> {
    const examInput: ExamInput = {
      modo: 'concurso',
      concurso: analysis.concurso,
      orgao: analysis.orgao,
      cargo: analysis.cargo,
      banca: analysis.banca,
      nivelEscolaridade: analysis.escolaridade,
      materia: selectedSubjects && selectedSubjects.length > 0 ? selectedSubjects.join(', ') : (analysis.materias[0]?.nome || 'Geral'),
      tipoQuestao: 'multipla_escolha',
      quantidade,
      nivel: 'medio'
    };

    console.log(`[EditalExamService] Requesting edital exam from backend...`);

    try {
      const response = await fetch('/api/gemini/generate-edital-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, quantidade, selectedSubjects })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.json() as ExamOutput;
      
      // Camada de validação e limpeza para garantir aderência ao cargo
      result.questoes = validateAndCleanQuestions(result.questoes, examInput);

      // Garantir que cada questão tenha o sourceMode correto
      result.questoes = result.questoes.map(q => ({
        ...q,
        sourceMode: 'edital_based'
      }));

      // Adicionar metadados do edital ao resultado
      result.modo = 'edital';
      result.concurso = analysis.concurso;
      result.orgao = analysis.orgao;
      result.cargo = analysis.cargo;
      result.banca = analysis.banca;
      result.nivelEscolaridade = analysis.escolaridade;
      result.nivel = 'medio';
      result.tipoQuestao = 'multipla_escolha';

      return result;
    } catch (error) {
      console.error("[EditalExamService] Error calling backend for edital exam:", error);
      return generateMockExam(examInput);
    }
  }
};
