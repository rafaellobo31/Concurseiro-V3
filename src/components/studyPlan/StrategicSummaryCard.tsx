import { StrategicSummary } from '../../types/studyPlan';
import { ShieldCheck, Info } from 'lucide-react';

export function StrategicSummaryCard({ summary }: { summary: StrategicSummary }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          {summary.titulo}
        </h3>
      </div>

      <div className="bg-indigo-50/30 p-6 rounded-2xl border border-indigo-100/50">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-gray-700 leading-relaxed text-lg italic">
            "{summary.descricao}"
          </p>
        </div>
      </div>
    </div>
  );
}
