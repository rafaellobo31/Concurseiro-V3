import { StudyPlanOutput, StudyPlanInput } from '../../types/studyPlan';
import { PrioritiesCard } from './PrioritiesCard';
import { WeeklyPlanCard } from './WeeklyPlanCard';
import { RecommendationsCard } from './RecommendationsCard';
import { Download, Share2, Printer, ChevronLeft, Sparkles } from 'lucide-react';

interface StudyPlanResultProps {
  plan: StudyPlanOutput;
  input: StudyPlanInput;
  onBack: () => void;
}

export function StudyPlanResult({ plan, input, onBack }: StudyPlanResultProps) {
  return (
    <div className="space-y-10 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para o formulário
        </button>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Download className="w-4 h-4" />
            Baixar PDF
          </button>
        </div>
      </div>

      {/* Main Report Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-bold">
          <Sparkles className="w-4 h-4" />
          Plano Estratégico Gerado por IA
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Seu Roteiro Personalizado de Aprovação
          </h2>
          <p className="text-gray-500 font-medium">
            Concurso: <span className="text-indigo-600">{input.concurso}</span> • Gerado em {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-8">
        <PrioritiesCard priorities={plan.prioridades} />
        
        <WeeklyPlanCard plan={plan.planoSemanal} />

        <RecommendationsCard recommendations={plan.recomendacoes} />
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center pt-10 border-t border-gray-100">
        <p className="text-xs text-gray-400 max-w-2xl mx-auto">
          Este plano de estudos foi gerado com base em metodologias de alta performance e no seu desempenho real. 
          Lembre-se que a adaptação individual é fundamental para o sucesso. Ajuste os tempos conforme sua evolução.
        </p>
      </div>
    </div>
  );
}
