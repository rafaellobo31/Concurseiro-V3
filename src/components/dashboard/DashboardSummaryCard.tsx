import { motion } from 'motion/react';
import { BookOpen, TrendingUp, Award, Clock, AlertCircle } from 'lucide-react';
import { DashboardMetrics } from '../../types/dashboard';
import { cn } from '../../utils/cn';

interface DashboardSummaryCardProps {
  metrics: DashboardMetrics;
}

export function DashboardSummaryCard({ metrics }: DashboardSummaryCardProps) {
  const getStatus = (percent: number) => {
    if (percent < 40) return 'Crítico';
    if (percent < 60) return 'Atenção';
    if (percent < 80) return 'Bom';
    return 'Forte';
  };

  const stats = [
    { label: 'Simulados Realizados', value: metrics.totalSimulados, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { 
      label: 'Média Geral', 
      value: `${metrics.mediaPercentual.toFixed(1)}%`, 
      subValue: getStatus(metrics.mediaPercentual),
      icon: TrendingUp, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { label: 'Melhor Desempenho', value: `${metrics.melhorPercentual.toFixed(1)}%`, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pior Desempenho', value: `${metrics.piorPercentual.toFixed(1)}%`, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                {stat.subValue && (
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">{stat.subValue}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
