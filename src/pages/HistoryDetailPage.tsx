import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Target, BookOpen, Landmark, AlertCircle } from 'lucide-react';
import { historyService } from '../services/historyService';
import { examReviewService, ExamReviewData } from '../services/examReviewService';
import { SimuladoHistoryItem } from '../types/history';
import { QuestionReviewCard } from '../components/history/QuestionReviewCard';
import { HistoryDetailSummary } from '../components/history/HistoryDetailSummary';
import { HistoryDetailEmptyState } from '../components/history/HistoryDetailEmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { FeedbackMessage } from '../components/ui/FeedbackMessage';

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [historyItem, setHistoryItem] = useState<SimuladoHistoryItem | null>(null);
  const [reviewData, setReviewData] = useState<ExamReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        // 1. Carrega o item básico do histórico (simulado_history)
        const item = await historyService.getHistoryItemById(id);
        setHistoryItem(item);

        // 2. Carrega os dados detalhados consolidados (exams, questions, answers)
        if (item?.examId) {
          const data = await examReviewService.getExamReviewById(item.examId);
          if (data) {
            setReviewData(data);
          }
        }
        setError(null);
      } catch (error) {
        console.error('[HistoryDetailPage] Erro ao carregar dados:', error);
        setError('Não foi possível carregar os detalhes deste simulado. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingState message="Carregando revisão pedagógica detalhada..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <FeedbackMessage 
          type="error" 
          title="Erro de Carregamento" 
          message={error} 
        />
      </div>
    );
  }

  if (!historyItem) {
    return <HistoryDetailEmptyState />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-4 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o histórico
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            {historyItem.concurso || historyItem.materia || 'Simulado'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(historyItem.createdAt).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {historyItem.mode === 'por_concurso' ? 'Por Concurso' : historyItem.mode === 'por_materia' ? 'Por Matéria' : 'Por Edital'}
            </span>
            {historyItem.banca && (
              <span className="flex items-center gap-1">
                <Landmark className="w-4 h-4" />
                {historyItem.banca}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{historyItem.acertos}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Acertos</div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-500">{historyItem.erros}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Erros</div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{historyItem.percentual.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Nota</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <HistoryDetailSummary stats={{
        acertos: historyItem.acertos,
        erros: historyItem.erros,
        percentual: historyItem.percentual,
        quantidadeQuestoes: historyItem.quantidadeQuestoes,
        nivelDesempenho: historyItem.nivelDesempenho
      }} />

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Análise de Desempenho
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              {historyItem.mensagemResumo}
            </p>
            
            {historyItem.assuntosParaRevisao && historyItem.assuntosParaRevisao.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">
                  Focar Revisão em:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {historyItem.assuntosParaRevisao.map((assunto, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/10 font-medium">
                      {assunto}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        </motion.div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Informações do Simulado</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Modo</span>
              <span className="text-sm font-bold text-slate-900 capitalize">{historyItem.mode.replace('por_', '')}</span>
            </div>
            {(historyItem.area || reviewData?.exam?.area) && (
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Área/Cargo</span>
                <span className="text-sm font-bold text-slate-900">{historyItem.area || reviewData?.exam?.area}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Questões</span>
              <span className="text-sm font-bold text-slate-900">{historyItem.quantidadeQuestoes}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500">Tipo</span>
              <span className="text-sm font-bold text-slate-900 capitalize">{historyItem.tipoQuestao || 'Múltipla Escolha'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="space-y-8 pt-8 border-t border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Revisão Pedagógica</h2>
            <p className="text-slate-500 font-medium mt-1">Analise seus erros e acertos para fortalecer sua base de conhecimento.</p>
          </div>
          <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acertos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full shadow-sm shadow-rose-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Erros</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {reviewData ? (
            reviewData.questions.map((question, idx) => (
              <QuestionReviewCard 
                key={question.id}
                question={question}
                index={idx}
              />
            ))
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-amber-900 mb-2">Detalhes das questões indisponíveis</h3>
              <p className="text-amber-700 text-sm max-w-md mx-auto leading-relaxed">
                Este simulado foi realizado antes da implementação da persistência detalhada ou houve um problema ao salvar os dados das questões.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
