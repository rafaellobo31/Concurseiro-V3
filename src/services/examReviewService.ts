import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DBExam, DBExamQuestion, DBExamAnswer } from '../types/examHistoryDetail';

export interface QuestionReviewData {
  id: string;
  ordem: number;
  enunciado: string;
  tipo: string;
  alternativas: any;
  correta: string;
  explicacao: string;
  ponto_revisao?: string;
  assunto: string;
  banca?: string;
  ano?: number;
  concurso_referencia?: string;
  cargo_referencia?: string;
  userAnswer?: string;
  isCorrect: boolean;
}

export interface ExamReviewData {
  exam: DBExam;
  questions: QuestionReviewData[];
}

export const examReviewService = {
  /**
   * Fetches all data needed for an exam review and consolidates it.
   */
  async getExamReviewById(examId: string): Promise<ExamReviewData | null> {
    if (!isSupabaseConfigured) return null;

    try {
      // 1. Fetch the exam metadata
      const { data: exam, error: examError } = await supabase!
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single();

      if (examError || !exam) {
        console.error('[ExamReviewService] Error fetching exam:', examError);
        return null;
      }

      // 2. Fetch all questions for this exam
      const { data: questions, error: questionsError } = await supabase!
        .from('exam_questions')
        .select('*')
        .eq('exam_id', examId)
        .order('ordem', { ascending: true });

      if (questionsError) {
        console.error('[ExamReviewService] Error fetching questions:', questionsError);
        return null;
      }

      // 3. Fetch all user answers for this exam
      const { data: answers, error: answersError } = await supabase!
        .from('exam_answers')
        .select('*')
        .eq('exam_id', examId);

      if (answersError) {
        console.error('[ExamReviewService] Error fetching answers:', answersError);
        return null;
      }

      // 4. Consolidate data
      const consolidatedQuestions: QuestionReviewData[] = (questions as DBExamQuestion[]).map(q => {
        const answer = (answers as DBExamAnswer[]).find(a => a.exam_question_id === q.id);
        return {
          id: q.id!,
          ordem: q.ordem,
          enunciado: q.enunciado,
          tipo: q.tipo,
          alternativas: q.alternativas,
          correta: q.correta,
          explicacao: q.explicacao,
          ponto_revisao: q.ponto_revisao,
          assunto: q.assunto,
          banca: q.banca,
          ano: q.ano,
          concurso_referencia: q.concurso_referencia,
          cargo_referencia: q.cargo_referencia,
          userAnswer: answer?.resposta_usuario,
          isCorrect: answer?.acertou || false
        };
      });

      return {
        exam: exam as DBExam,
        questions: consolidatedQuestions
      };
    } catch (err) {
      console.error('[ExamReviewService] Unexpected error:', err);
      return null;
    }
  }
};
