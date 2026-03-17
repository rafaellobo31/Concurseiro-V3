import { motion } from 'motion/react';
import { Target, CheckCircle2, XCircle } from 'lucide-react';
import { DashboardMetrics } from '../../types/dashboard';

interface DashboardStatsGridProps {
  metrics: DashboardMetrics;
}

export function DashboardStatsGrid({ metrics }: DashboardStatsGridProps) {
  const stats = [
    { label: 'Questões Respondidas', value: metrics.totalQuestoesRespondidas, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total de Acertos', value: metrics.totalAcertos, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total de Erros', value: metrics.totalErros, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 + 0.4 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
