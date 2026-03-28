import { StudyPlanOutput } from '../../types/studyPlan';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: StudyPlanOutput['recomendacoes'];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recomendações Pedagógicas</h3>
            <p className="text-sm text-gray-500 font-medium">Dicas estratégicas para otimizar sua preparação</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
