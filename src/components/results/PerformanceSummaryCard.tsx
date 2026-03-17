import React from 'react';
import { CorrectionSummary } from '../../types/correction';
import { Trophy, Clock, Target, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface PerformanceSummaryCardProps {
  summary: CorrectionSummary;
}

export function PerformanceSummaryCard({ summary }: PerformanceSummaryCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Excelente': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Bom': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Regular': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Insuficiente': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Crítico': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Score Circle */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * summary.score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                  summary.score >= 70 ? "text-emerald-500" : summary.score >= 50 ? "text-amber-500" : "text-red-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black text-gray-900">{Math.round(summary.score)}%</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Aproveitamento</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400">
                <Target className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Questões</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{summary.totalQuestions}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Acertos</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{summary.correctAnswers}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Erros</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{summary.incorrectAnswers}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Tempo</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{formatTime(summary.timeSpent)}</p>
            </div>

            <div className="col-span-2 space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Desempenho</span>
              </div>
              <div className={cn(
                "inline-flex items-center px-4 py-2 rounded-xl border font-black text-sm uppercase tracking-wider",
                getLevelColor(summary.performanceLevel)
              )}>
                {summary.performanceLevel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
