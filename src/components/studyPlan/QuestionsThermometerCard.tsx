import { QuestionsThermometer } from '../../types/studyPlan';
import { Thermometer, Info, Flame } from 'lucide-react';
import { cn } from '../../utils/cn';

export function QuestionsThermometerCard({ thermometer }: { thermometer: QuestionsThermometer }) {
  const intensityStyles = {
    'baixa': 'text-blue-600 bg-blue-50 border-blue-100',
    'moderada': 'text-green-600 bg-green-50 border-green-100',
    'alta': 'text-amber-600 bg-amber-50 border-amber-100',
    'intensa': 'text-red-600 bg-red-50 border-red-100'
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Thermometer className="w-6 h-6 text-indigo-600" />
          Termômetro de Questões
        </h3>
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 capitalize",
          intensityStyles[thermometer.intensidade]
        )}>
          <Flame className="w-4 h-4" />
          Intensidade: {thermometer.intensidade}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meta Semanal</span>
            <p className="text-3xl font-extrabold text-gray-900">{thermometer.metaSemanal}</p>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">{thermometer.justificativa}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900">Por que focar em questões?</h4>
          <ul className="space-y-3">
            {[
              'Fixação ativa do conteúdo estudado.',
              'Identificação de padrões da banca examinadora.',
              'Simulação real do tempo de prova.',
              'Mapeamento de pontos de melhoria imediata.'
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
