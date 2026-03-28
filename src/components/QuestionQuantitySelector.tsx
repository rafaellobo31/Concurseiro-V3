interface QuestionQuantitySelectorProps {
  selectedCount: number;
  onSelectCount: (count: number) => void;
}

export function QuestionQuantitySelector({
  selectedCount,
  onSelectCount
}: QuestionQuantitySelectorProps) {
  const options = [5, 10, 20, 30, 50];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Quantidade de Questões</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selectedCount === option;
          return (
            <button
              key={option}
              onClick={() => onSelectCount(option)}
              className={`px-6 py-3 rounded-2xl border-2 font-bold transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                  : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
