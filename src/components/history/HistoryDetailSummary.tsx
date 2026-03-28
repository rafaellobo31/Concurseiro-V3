import React from 'react';
import { Target, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryDetailSummaryProps {
  stats: {
    acertos: number;
    erros: number;
    percentual: number;
    quantidadeQuestoes: number;
    nivelDesempenho: string;
    tempoGasto?: number;
  };
}

export function HistoryDetailSummary({ stats }: HistoryDetailSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acertos</p>
          <p className="text-xl font-black text-slate-900">{stats.acertos}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Erros</p>
          <p className="text-xl font-black text-slate-900">{stats.erros}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Desempenho</p>
          <p className="text-xl font-black text-slate-900">{stats.percentual.toFixed(1)}%</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nível</p>
          <p className="text-lg font-black text-slate-900">{stats.nivelDesempenho}</p>
        </div>
      </motion.div>
    </div>
  );
}
