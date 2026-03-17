import { MainTopic } from '../../types/studyPlan';
import { ListChecks, Bookmark } from 'lucide-react';

export function MainTopicsCard({ topics }: { topics: MainTopic[] }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <ListChecks className="w-6 h-6 text-indigo-600" />
        Assuntos Principais e Foco Inicial
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, idx) => (
          <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Bookmark className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Matéria</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900">{topic.materia}</h4>
            <div className="flex flex-wrap gap-2">
              {topic.topicos.map((t, i) => (
                <span key={i} className="bg-white px-3 py-1 rounded-full text-[10px] font-medium text-gray-600 border border-gray-100">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
