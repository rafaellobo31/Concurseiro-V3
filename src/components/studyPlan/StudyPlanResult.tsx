import { StudyPlanOutput, StudyPlanInput } from '../../types/studyPlan';
import { StrategicSummaryCard } from './StrategicSummaryCard';
import { WeeklyScheduleCard } from './WeeklyScheduleCard';
import { PrioritySubjectsCard } from './PrioritySubjectsCard';
import { QuestionsThermometerCard } from './QuestionsThermometerCard';
import { BankStrategyCard } from './BankStrategyCard';
import { ReviewCycleCard } from './ReviewCycleCard';
import { MainTopicsCard } from './MainTopicsCard';
import { PerformanceOrientationCard } from './PerformanceOrientationCard';
import { Download, Share2, Printer, ChevronLeft } from 'lucide-react';

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
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Relatório Estratégico de Preparação
        </h2>
        <p className="text-gray-500 font-medium">
          Personalizado para: <span className="text-indigo-600">{input.concurso}</span> • Gerado em {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="space-y-8">
        <StrategicSummaryCard summary={plan.resumoEstrategico} />
        
        <WeeklyScheduleCard schedule={plan.gradeSemanal} load={plan.cargaSemanal} />

        <PrioritySubjectsCard priorities={plan.materiasPrioritarias} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuestionsThermometerCard thermometer={plan.termometroQuestoes} />
          <BankStrategyCard strategy={plan.estrategiaBanca} />
        </div>

        <ReviewCycleCard cycle={plan.cicloRevisao} />

        <MainTopicsCard topics={plan.assuntosPrincipais} />

        <PerformanceOrientationCard performance={plan.orientacaoFinal} />
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center pt-10 border-t border-gray-100">
        <p className="text-xs text-gray-400 max-w-2xl mx-auto">
          Este plano de estudos foi gerado com base em metodologias de alta performance. 
          Lembre-se que a adaptação individual é fundamental para o sucesso. Ajuste os tempos conforme sua evolução.
        </p>
      </div>
    </div>
  );
}
