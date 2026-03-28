import { DashboardMetrics } from '../../types/dashboard';
import { AlertTriangle, TrendingDown, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface CriticalTopicsCardProps {
  assuntos: DashboardMetrics['assuntosCriticos'];
}

export function CriticalTopicsCard({ assuntos }: CriticalTopicsCardProps) {
  if (!assuntos || assuntos.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-xl text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Assuntos Críticos</h3>
            <p className="text-sm text-gray-500">Tópicos que precisam de atenção imediata</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {assuntos.map((item, index) => (
          <div 
            key={index}
            className="group p-4 rounded-2xl bg-gray-50 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800 group-hover:text-red-900 transition-colors">
                {item.assunto}
              </span>
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <TrendingDown className="w-4 h-4" />
                {item.percentual.toFixed(0)}%
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentual}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                {item.erros} erros identificados
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-top border-gray-100">
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <Target className="w-5 h-5 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            <span className="font-bold">Dica Estratégica:</span> Foque em revisar a teoria destes assuntos antes de tentar novos simulados. A repetição do erro consolida o aprendizado equivocado.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
