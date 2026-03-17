import { ReviewCycle } from '../../types/studyPlan';
import { RefreshCw, Clock, Calendar, Layers } from 'lucide-react';

export function ReviewCycleCard({ cycle }: { cycle: ReviewCycle }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <RefreshCw className="w-6 h-6 text-indigo-600" />
        Ciclo de Revisão Inteligente
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900">Revisão Curta</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{cycle.curta}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900">Revisão Semanal</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{cycle.semanal}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900">Revisão Acumulada</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{cycle.acumulada}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
