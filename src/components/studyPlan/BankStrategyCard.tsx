import { BankStrategy } from '../../types/studyPlan';
import { Building2, Search, Target, BookOpen, Lightbulb } from 'lucide-react';

export function BankStrategyCard({ strategy }: { strategy: BankStrategy }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-indigo-600" />
        Estratégia por Perfil de Banca: {strategy.banca}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4" />
              Metodologia da Banca
            </label>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {strategy.metodologia}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" />
              Perfil de Cobrança
            </label>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {strategy.perfil}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
