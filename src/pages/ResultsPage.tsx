import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Share2, Download, Printer, History, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { CorrectionOutput } from '../types/correction';
import { PerformanceSummaryCard } from '../components/results/PerformanceSummaryCard';
import { PerformanceMessageCard } from '../components/results/PerformanceMessageCard';
import { QuestionReviewCard } from '../components/results/QuestionReviewCard';
import { StrengthsCard } from '../components/results/StrengthsCard';
import { WeaknessesCard } from '../components/results/WeaknessesCard';
import { RecommendationsCard } from '../components/results/RecommendationsCard';
import { ResultActions } from '../components/results/ResultActions';

export default function ResultsPage() {
  const location = useLocation();
  const correction = location.state?.correction as CorrectionOutput;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!correction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Relatório não encontrado</h2>
          <p className="text-gray-500 mb-8">Não conseguimos localizar os dados deste simulado. Tente gerar um novo.</p>
          <Link to="/simulados" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Ir para o Gerador
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Bar / Actions */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">
              C
            </div>
            <span className="font-black text-gray-900 uppercase tracking-tighter text-lg hidden sm:block">Relatório de Desempenho</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Compartilhar">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Baixar PDF">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Imprimir">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Simulado Concluído
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
            Sua jornada rumo à <span className="text-indigo-600">aprovação</span>.
          </h1>
        </motion.div>

        {/* Summary & Message */}
        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PerformanceSummaryCard summary={correction.summary} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PerformanceMessageCard score={correction.summary.score} level={correction.summary.performanceLevel} />
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StrengthsCard strengths={correction.analysis.strengths} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <WeaknessesCard weaknesses={correction.analysis.weaknesses} />
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <RecommendationsCard recommendations={correction.analysis.recommendations} />
        </motion.div>

        {/* Question Review Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Revisão Pedagógica</h2>
              <p className="text-gray-500 font-medium">Analise cada resposta e entenda os fundamentos por trás do gabarito.</p>
            </div>
            <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Acertos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Erros</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {correction.results.map((result, index) => (
              <motion.div
                key={result.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.05) }}
              >
                <QuestionReviewCard result={result} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-10 border-t border-gray-200"
        >
          <ResultActions />
        </motion.div>
      </div>
    </div>
  );
}
