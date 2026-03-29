import { editalAnalysisService } from './editalAnalysisService';
import { editalExamService } from './editalExamService';
import { EditalAnalysis, EditalAnalysisResult } from '../types/edital';
import { ExamOutput } from '../types/exam';
import { extractTextFromPdf } from '../utils/pdfUtils';

export const editalService = {
  /**
   * Passo 1: Extrair texto do PDF
   */
  async extractText(file: File): Promise<string> {
    return extractTextFromPdf(file);
  },

  /**
   * Passo 2: Analisar o edital
   */
  async analyze(text: string, onRetry?: (attempt: number) => void): Promise<EditalAnalysisResult> {
    return editalAnalysisService.analyzeEdital(text, onRetry);
  },

  /**
   * Método de conveniência que extrai e analisa o edital de um arquivo.
   */
  async analyzeEdital(file: File, onRetry?: (attempt: number) => void): Promise<EditalAnalysisResult> {
    const text = await this.extractText(file);
    return this.analyze(text, onRetry);
  },

  /**
   * Passo 3: Gerar simulado baseado na análise
   */
  async generateExam(analysis: EditalAnalysis, quantidade: number = 10, selectedSubjects?: string[], onRetry?: (attempt: number) => void): Promise<ExamOutput> {
    return editalExamService.generateEditalExam(analysis, quantidade, selectedSubjects, onRetry);
  }
};
