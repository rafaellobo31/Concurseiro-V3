import { SimuladoHistoryItem } from '../../types/history';
import { Calendar, ChevronRight, Landmark, BookOpen, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface HistoryItemCardProps {
  record: SimuladoHistoryItem;
  index: number;
  key?: string;
}

export function HistoryItemCard({ record, index }: HistoryItemCardProps) {
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const getScoreColor = (percent: number) => {
    if (percent >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (percent >= 60) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (percent >= 40) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3 rounded-xl",
            record.mode === 'por_concurso' ? "bg-indigo-50 text-indigo-600" : "bg-purple-50 text-purple-600"
          )}>
            {record.mode === 'por_concurso' ? <Landmark className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {record.mode === 'por_concurso' ? record.concurso : record.materia}
              </h4>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider">
                {record.mode.replace('por_', '')}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(record.createdAt)}
              </div>
              {record.area && (
                <div className="flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5" />
                  {record.area}
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-700">{record.quantidadeQuestoes}</span> questões
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Acertos</p>
              <p className="text-lg font-black text-gray-900 leading-none">
                {record.acertos}<span className="text-gray-300 text-sm font-medium ml-0.5">/{record.quantidadeQuestoes}</span>
              </p>
            </div>
            
            <div className={cn(
              "px-4 py-2 rounded-xl border-2 font-black text-lg min-w-[80px] text-center",
              getScoreColor(record.percentual)
            )}>
              {record.percentual.toFixed(0)}%
            </div>
          </div>
          
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
