import { FinalOrientation } from '../../types/studyPlan';
import { Zap, XCircle, Rocket } from 'lucide-react';

export function PerformanceOrientationCard({ performance }: { performance: FinalOrientation }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Zap className="w-6 h-6 text-indigo-600" />
        Orientação Final de Performance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-red-600 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              O que evitar
            </h4>
            <ul className="space-y-3">
              {performance.errosEvitar.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-1 h-1 bg-red-400 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-indigo-900 rounded-3xl p-8 text-white space-y-6 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Rocket className="w-40 h-40" />
          </div>
          
          <div className="relative space-y-4">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-400" />
              Recomendação Final
            </h4>
            <p className="text-indigo-100 leading-relaxed italic">
              "{performance.mensagem}"
            </p>
            <div className="pt-4">
              <div className="h-1 w-20 bg-indigo-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
