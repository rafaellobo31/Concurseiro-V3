import { motion } from 'motion/react';
import { Settings, Play, AlertCircle, Sparkles } from 'lucide-react';
import { MatterSelector } from './MatterSelector';
import { QuestionQuantitySelector } from './QuestionQuantitySelector';
import { EditalAnalysis } from '../types/edital';
import { usePlan } from '../hooks/usePlan';

interface EditalSimuladoConfigProps {
  analysis: EditalAnalysis;
  selectedSubjects: string[];
  onToggleSubject: (subject: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  selectedQuestionCount: number;
  onSelectQuestionCount: (count: number) => void;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

export function EditalSimuladoConfig({
  analysis,
  selectedSubjects,
  onToggleSubject,
  onSelectAll,
  onDeselectAll,
  selectedQuestionCount,
  onSelectQuestionCount,
  onGenerate,
  onBack,
  isGenerating
}: EditalSimuladoConfigProps) {
  const { isFree } = usePlan();
  const isButtonDisabled = selectedSubjects.length === 0 || isGenerating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-xl shadow-gray-100/50 space-y-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Configurar Simulado</h2>
            <p className="text-gray-500 font-medium">Personalize seu treino agora</p>
          </div>
        </div>
        {isFree && (
          <div className="hidden md:flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100">
            <Sparkles size={14} />
            Recurso Premium
          </div>
        )}
      </div>

      <div className="space-y-10">
        <MatterSelector
          materias={analysis.materias}
          selectedSubjects={selectedSubjects}
          onToggleSubject={onToggleSubject}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
        />

        <QuestionQuantitySelector
          selectedCount={selectedQuestionCount}
          onSelectCount={onSelectQuestionCount}
        />
      </div>

      <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <button
          onClick={onBack}
          className="text-gray-500 font-bold hover:text-indigo-600 transition-all px-6 py-3"
        >
          Voltar para Resumo
        </button>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          {selectedSubjects.length === 0 && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 animate-pulse">
              <AlertCircle className="w-4 h-4" />
              Selecione pelo menos uma matéria para continuar.
            </div>
          )}

          {isFree && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100">
              <Sparkles className="w-4 h-4" />
              Simulados completos por edital estão disponíveis no plano Pro.
            </div>
          )}
          
          <button
            onClick={() => {
              if (isFree) return;
              onGenerate();
            }}
            disabled={isButtonDisabled || isFree}
            className={`w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-lg transition-all ${
              isButtonDisabled || isFree
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-xl shadow-indigo-200 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                Gerar Simulado
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
