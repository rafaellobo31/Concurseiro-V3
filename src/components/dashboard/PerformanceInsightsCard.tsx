import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface PerformanceInsightsCardProps {
  insights: {
    pontosFortes: string[];
    pontosFracos: string[];
    recomendacoes: string[];
  };
}

export function PerformanceInsightsCard({ insights }: PerformanceInsightsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-gray-900">Análise Inteligente</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {/* Pontos Fortes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Seus Pontos Fortes
          </div>
          
          {insights.pontosFortes.length > 0 ? (
            <div className="space-y-2">
              {insights.pontosFortes.map((insight, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-emerald-900 leading-tight">{insight}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">Continue realizando simulados para identificar seus pontos fortes.</p>
          )}
        </div>

        {/* Pontos Fracos */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            Onde Melhorar
          </div>
          
          {insights.pontosFracos.length > 0 ? (
            <div className="space-y-2">
              {insights.pontosFracos.map((insight, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100"
                >
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-orange-900 leading-tight">{insight}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">Sua performance está equilibrada. Continue assim!</p>
          )}
        </div>

        {/* Recomendações */}
        {insights.recomendacoes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Recomendações Estratégicas
            </div>
            
            <div className="space-y-2">
              {insights.recomendacoes.map((insight, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.6 }}
                  className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100"
                >
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                  <p className="text-sm font-medium text-indigo-900 leading-tight">{insight}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
