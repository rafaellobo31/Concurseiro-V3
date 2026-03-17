import { Link } from 'react-router-dom';
import { ChevronRight, Landmark, BookOpen } from 'lucide-react';
import { SimuladoHistoryItem } from '../../types/history';
import { cn } from '../../utils/cn';

interface RecentActivityCardProps {
  activities: SimuladoHistoryItem[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Atividade Recente</h3>
        <Link to="/history" className="text-indigo-600 text-xs font-bold hover:underline">Ver tudo</Link>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activities.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    activity.mode === 'por_concurso' ? "bg-indigo-50 text-indigo-600" : "bg-purple-50 text-purple-600"
                  )}>
                    {activity.mode === 'por_concurso' ? <Landmark className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                      {activity.mode === 'por_concurso' ? activity.concurso : activity.materia}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">{formatDate(activity.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-black",
                    activity.percentual >= 70 ? "text-emerald-600" : activity.percentual >= 50 ? "text-blue-600" : "text-orange-600"
                  )}>
                    {activity.percentual.toFixed(0)}%
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">{activity.acertos}/{activity.quantidadeQuestoes}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm font-medium">Nenhuma atividade ainda.</p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50/50 text-center border-t border-gray-50">
        <Link to="/history" className="text-xs font-bold text-indigo-600 hover:underline flex items-center justify-center gap-1">
          Ver histórico completo <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
