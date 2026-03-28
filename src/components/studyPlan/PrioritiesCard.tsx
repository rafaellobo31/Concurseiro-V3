import { StudyPlanOutput } from '../../types/studyPlan';
import { AlertCircle, ArrowUpCircle, ArrowRightCircle, ArrowDownCircle } from 'lucide-react';

interface PrioritiesCardProps {
  priorities: StudyPlanOutput['prioridades'];
}

export function PrioritiesCard({ priorities }: PrioritiesCardProps) {
  const getPriorityIcon = (level: string) => {
    switch (level) {
      case 'Alta': return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      case 'Média': return <ArrowRightCircle className="w-5 h-5 text-amber-500" />;
      case 'Baixa': return <ArrowDownCircle className="w-5 h-5 text-emerald-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityBadge = (level: string) => {
    switch (level) {
      case 'Alta': return 'bg-red-50 text-red-700 border-red-100';
      case 'Média': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Baixa': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <AlertCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Prioridades Estratégicas</h3>
            <p className="text-sm text-gray-500 font-medium">Matérias que exigem maior atenção com base no seu desempenho</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {priorities.map((item, index) => (
            <div 
              key={index}
              className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityBadge(item.nivelPrioridade)}`}>
                  Prioridade {item.nivelPrioridade}
                </div>
                {getPriorityIcon(item.nivelPrioridade)}
              </div>
              
              <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {item.materia}
              </h4>
              
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {item.motivo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
