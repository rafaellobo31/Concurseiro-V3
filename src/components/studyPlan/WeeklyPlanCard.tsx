import { StudyPlanOutput } from '../../types/studyPlan';
import { Calendar, Clock, BookOpen, RefreshCw, Target } from 'lucide-react';

interface WeeklyPlanCardProps {
  plan: StudyPlanOutput['planoSemanal'];
}

export function WeeklyPlanCard({ plan }: WeeklyPlanCardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'teoria': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'revisão': return <RefreshCw className="w-4 h-4 text-emerald-500" />;
      case 'simulado': return <Target className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'teoria': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'revisão': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'simulado': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Plano Semanal Estratégico</h3>
            <p className="text-sm text-gray-500 font-medium">Cronograma detalhado para sua jornada de aprovação</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plan.map((day, index) => (
            <div 
              key={index}
              className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all group"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-50 group-hover:text-indigo-600 transition-colors">
                {day.dia}
              </h4>
              
              <div className="space-y-4">
                {day.atividades.map((activity, actIndex) => (
                  <div key={actIndex} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-bold text-gray-800 leading-tight">
                        {activity.materia}
                      </span>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getActivityBadge(activity.tipo)}`}>
                        {activity.tipo}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Clock className="w-3 h-3" />
                      {activity.tempo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
