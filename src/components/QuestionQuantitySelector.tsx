import { usePlan } from '../hooks/usePlan';
import { Sparkles } from 'lucide-react';

interface QuestionQuantitySelectorProps {
  selectedCount: number;
  onSelectCount: (count: number) => void;
}

export function QuestionQuantitySelector({
  selectedCount,
  onSelectCount
}: QuestionQuantitySelectorProps) {
  const { isFree } = usePlan();
  const options = [4, 10, 20, 30, 50];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Quantidade de Questões</h3>
        {isFree && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} />
            Plano Free: limite de 4 questões
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selectedCount === option;
          const isRestricted = isFree && option > 4;
          
          return (
            <div key={option} className="relative group">
              <button
                type="button"
                onClick={() => {
                  if (isRestricted) return;
                  onSelectCount(option);
                }}
                className={`px-6 py-3 rounded-2xl border-2 font-bold transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                    : isRestricted
                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {option}
              </button>
              
              {isRestricted && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center shadow-xl">
                  Simulados maiores fazem parte do plano Pro.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
