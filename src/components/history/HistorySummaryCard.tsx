import { HistoryStats } from '../../types/history';
import { Target, Award, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface HistorySummaryCardProps {
  stats: HistoryStats;
}

export function HistorySummaryCard({ stats }: HistorySummaryCardProps) {
  const cards = [
    {
      label: 'Total de Simulados',
      value: stats.totalSimulados,
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Média de Acertos',
      value: `${stats.mediaAcertos.toFixed(1)}%`,
      icon: Target,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Total de Questões',
      value: stats.totalQuestoes,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Melhor Desempenho',
      value: stats.melhorMateria || 'N/A',
      icon: Award,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
              <p className="text-xl font-black text-gray-900">{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
