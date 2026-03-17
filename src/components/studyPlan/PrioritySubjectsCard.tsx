import { PrioritySubject } from '../../types/studyPlan';
import { Award, Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PrioritySubjectsCard({ priorities }: { priorities: PrioritySubject[] }) {
  const weightColors = {
    'baixo': 'text-blue-600 bg-blue-50',
    'médio': 'text-amber-600 bg-amber-50',
    'alto': 'text-red-600 bg-red-50'
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Award className="w-6 h-6 text-indigo-600" />
        Matérias Prioritárias
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {priorities.map((subject, idx) => (
          <div key={idx} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 overflow-hidden group hover:border-indigo-200 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star className="w-12 h-12 text-indigo-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg",
                  weightColors[subject.peso]
                )}>
                  Peso: {subject.peso}
                </span>
              </div>
              <h4 className="font-bold text-gray-900">{subject.nome}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{subject.justificativa}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
