import { supabase, isSupabaseConfigured } from './supabaseClient';
import { FullExamPersistencePayload } from '../types/examHistoryDetail';
import { historyService } from './historyService';

export const examPersistenceService = {
  /**
   * Saves a completed exam with all details (summary, exam, questions, answers).
   */
  async saveExamResult(payload: FullExamPersistencePayload): Promise<{ examId: string | null }> {
    console.log('[ExamPersistenceService] saveExamResult chamado com payload:', payload);
    if (!isSupabaseConfigured) {
      console.warn('[ExamPersistenceService] Supabase not configured. Detailed persistence skipped.');
      return { examId: null };
    }

    try {
      const { data: { user } } = await supabase!.auth.getUser();
      console.log('[ExamPersistenceService] Usuário autenticado:', user);
      if (!user) {
        console.warn('[ExamPersistenceService] No authenticated user. Detailed persistence skipped.');
        return { examId: null };
      }

      const { exam, correction, userAnswers } = payload;
      
      // 1. Save to exams table (Full persistence) FIRST to get the exam_id
      const examData = {
        user_id: user.id,
        mode: exam.modo,
        origem_questoes: exam.questoes.some(q => q.sourceMode === 'edital_based') ? 'edital' : 'ia',
        concurso: exam.concurso,
        materia: exam.materia,
        area: exam.cargo,
        banca: exam.banca,
        quantidade_questoes: correction.summary.totalQuestions,
        acertos: correction.summary.correctAnswers,
        erros: correction.summary.totalQuestions - correction.summary.correctAnswers,
        percentual: correction.summary.score
      };

      console.log('[ExamPersistenceService] saving exam payload:', examData);
      const { data: savedExam, error: examError } = await supabase!
        .from('exams')
        .insert(examData)
        .select()
        .single();

      if (examError) {
        console.error('[ExamPersistenceService] error saving exam:', examError);
        throw examError;
      }

      if (!savedExam) {
        throw new Error('[ExamPersistenceService] No exam data returned after insert');
      }

      const examId = savedExam.id;
      console.log('[ExamPersistenceService] exam created id:', examId);

      // 2. Save summary to simulado_history (existing dashboard compatibility)
      console.log('[ExamPersistenceService] Preparando salvamento em simulado_history com examId:', examId);
      await historyService.saveHistoryItem({
        mode: exam.modo === 'concurso' ? 'por_concurso' : (exam.modo === 'edital' ? 'por_edital' : 'por_materia'),
        tipoQuestao: exam.tipoQuestao,
        origemQuestoes: exam.questoes.some(q => q.sourceMode === 'edital_based') 
          ? 'baseado_em_edital' 
          : (exam.questoes.some(q => q.sourceMode === 'previous_exam_based') ? 'provas_anteriores' : 'ia_generativa'),
        concurso: exam.concurso,
        materia: exam.materia,
        area: exam.cargo,
        banca: exam.banca,
        quantidadeQuestoes: correction.summary.totalQuestions,
        acertos: correction.summary.correctAnswers,
        erros: correction.summary.totalQuestions - correction.summary.correctAnswers,
        percentual: correction.summary.score,
        nivelDesempenho: correction.summary.performanceLevel,
        assuntosParaRevisao: correction.analysis.weaknesses,
        mensagemResumo: correction.analysis.recommendations.join(' '),
        examId: examId, // Link to the detailed tables
      });

      // 3. Save to exam_questions and 4. Save to exam_answers
      console.log('[ExamPersistenceService] saving questions and answers...');
      for (let i = 0; i < exam.questoes.length; i++) {
        const q = exam.questoes[i];
        const questionResult = correction.results.find(r => r.questionId === q.id);
        const userAnswer = userAnswers.find(ua => ua.questionId === q.id);

        const questionData = {
          exam_id: examId,
          ordem: i + 1,
          enunciado: q.enunciado,
          tipo: q.tipo || exam.tipoQuestao,
          alternativas: q.alternativas,
          correta: q.correta || '',
          explicacao: q.explicacao,
          ponto_revisao: questionResult?.feedback,
          assunto: q.assunto,
          banca: q.banca,
          ano: q.ano,
          concurso_referencia: q.concursoReferencia || exam.concurso,
          cargo_referencia: exam.cargo
        };

        console.log(`[ExamPersistenceService] saving question ${i + 1} payload:`, questionData);
        const { data: savedQuestion, error: questionError } = await supabase!
          .from('exam_questions')
          .insert(questionData)
          .select()
          .single();

        if (questionError) {
          console.error(`[ExamPersistenceService] error saving question ${i + 1}:`, questionError);
          throw questionError;
        }

        if (!savedQuestion) {
          throw new Error(`[ExamPersistenceService] No question data returned for question ${i + 1}`);
        }

        console.log(`[ExamPersistenceService] question ${i + 1} saved:`, savedQuestion);

        // Save answer
        const answerData = {
          exam_id: examId,
          exam_question_id: savedQuestion.id,
          resposta_usuario: userAnswer?.selectedOption,
          acertou: questionResult?.isCorrect || false,
        };

        console.log(`[ExamPersistenceService] saving answer ${i + 1} payload:`, answerData);
        const { data: savedAnswer, error: answerError } = await supabase!
          .from('exam_answers')
          .insert(answerData)
          .select()
          .single();

        if (answerError) {
          console.error(`[ExamPersistenceService] error saving answer for question ${i + 1}:`, answerError);
          throw answerError;
        }

        console.log(`[ExamPersistenceService] answer for question ${i + 1} saved:`, savedAnswer);
      }

      console.log('[ExamPersistenceService] insert success');
      return { examId };
    } catch (err) {
      console.error('[ExamPersistenceService] Unexpected error:', err);
      return { examId: null };
    }
  },

  /**
   * Loads a full exam with questions and answers.
   */
  async getFullExam(examId: string) {
    if (!isSupabaseConfigured) return null;

    try {
      const { data: exam, error: examError } = await supabase!
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single();

      if (examError || !exam) return null;

      const { data: questions, error: questionsError } = await supabase!
        .from('exam_questions')
        .select('*')
        .eq('exam_id', examId)
        .order('ordem', { ascending: true });

      if (questionsError) return null;

      const { data: answers, error: answersError } = await supabase!
        .from('exam_answers')
        .select('*')
        .eq('exam_id', examId);

      if (answersError) return null;

      return {
        exam,
        questions,
        answers
      };
    } catch (err) {
      console.error('[ExamPersistenceService] Error loading full exam:', err);
      return null;
    }
  }
};
