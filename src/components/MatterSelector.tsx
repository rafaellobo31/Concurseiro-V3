import { EditalMateria } from '../types/edital';

interface MatterSelectorProps {
  materias: EditalMateria[];
  selectedSubjects: string[];
  onToggleSubject: (subject: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function MatterSelector({
  materias,
  selectedSubjects,
  onToggleSubject,
  onSelectAll,
  onDeselectAll
}: MatterSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Selecione as Matérias</h3>
        <div className="flex gap-4">
          <button
            onClick={onSelectAll}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
          >
            Selecionar Todas
          </button>
          <button
            onClick={onDeselectAll}
            className="text-xs font-bold text-gray-500 hover:text-gray-600 uppercase tracking-wider"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {materias.map((materia) => {
          const isSelected = selectedSubjects.includes(materia.nome);
          return (
            <button
              key={materia.nome}
              onClick={() => onToggleSubject(materia.nome)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50'
                  : 'border-gray-100 bg-white hover:border-indigo-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
              }`}>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <span className={`font-bold block ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                  {materia.nome}
                </span>
                <span className="text-xs text-gray-500">
                  {materia.topicos.length} tópicos identificados
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
