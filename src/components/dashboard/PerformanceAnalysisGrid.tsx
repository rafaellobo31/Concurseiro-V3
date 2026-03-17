import { motion } from 'motion/react';
import { BookOpen, Award, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardMetrics } from '../../types/dashboard';

interface PerformanceAnalysisGridProps {
  metrics: DashboardMetrics;
}

export function PerformanceAnalysisGrid({ metrics }: PerformanceAnalysisGridProps) {
  const getStatus = (percent: number) => {
    if (percent < 40) return 'Crítico';
    if (percent < 60) return 'Atenção';
    if (percent < 80) return 'Bom';
    return 'Forte';
  };

  const trendIcons = {
    melhora: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Em Melhora' },
    estabilidade: { icon: Minus, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Estável' },
    queda: { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', label: 'Em Queda' }
  };

  const trend = trendIcons[metrics.tendenciaRecente];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Análise por Matéria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900">Desempenho por Matéria</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${trend.bg} ${trend.color}`}>
            <trend.icon className="w-3 h-3" />
            {trend.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Melhor Matéria</span>
            </div>
            {metrics.analisePorMateria.melhor ? (
              <>
                <p className="text-sm font-bold text-emerald-900 truncate">{metrics.analisePorMateria.melhor.nome}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-emerald-600">{metrics.analisePorMateria.melhor.percentual.toFixed(0)}%</p>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase">{getStatus(metrics.analisePorMateria.melhor.percentual)}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">Dados insuficientes</p>
            )}
          </div>

          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Pior Matéria</span>
            </div>
            {metrics.analisePorMateria.pior ? (
              <>
                <p className="text-sm font-bold text-red-900 truncate">{metrics.analisePorMateria.pior.nome}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-red-600">{metrics.analisePorMateria.pior.percentual.toFixed(0)}%</p>
                  <span className="text-[10px] font-bold text-red-500 uppercase">{getStatus(metrics.analisePorMateria.pior.percentual)}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">Dados insuficientes</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Análise por Concurso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-gray-900">Desempenho por Concurso</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Melhor Foco</span>
            </div>
            {metrics.analisePorConcurso.melhor ? (
              <>
                <p className="text-sm font-bold text-purple-900 truncate">{metrics.analisePorConcurso.melhor.nome}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-purple-600">{metrics.analisePorConcurso.melhor.percentual.toFixed(0)}%</p>
                  <span className="text-[10px] font-bold text-purple-500 uppercase">{getStatus(metrics.analisePorConcurso.melhor.percentual)}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">Dados insuficientes</p>
            )}
          </div>

          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Pior Foco</span>
            </div>
            {metrics.analisePorConcurso.pior ? (
              <>
                <p className="text-sm font-bold text-orange-900 truncate">{metrics.analisePorConcurso.pior.nome}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-orange-600">{metrics.analisePorConcurso.pior.percentual.toFixed(0)}%</p>
                  <span className="text-[10px] font-bold text-orange-500 uppercase">{getStatus(metrics.analisePorConcurso.pior.percentual)}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">Dados insuficientes</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
