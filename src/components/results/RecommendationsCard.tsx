import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: string[];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="bg-indigo-900 rounded-3xl shadow-xl shadow-indigo-200 overflow-hidden">
      <div className="p-8 border-b border-indigo-800 flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-indigo-900 shadow-lg shadow-amber-400/20">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Plano de Ação</h3>
          <p className="text-indigo-300 text-sm font-medium">Recomendações estratégicas para sua evolução</p>
        </div>
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-indigo-800/50 p-5 rounded-2xl border border-indigo-700 flex items-start gap-4 group hover:bg-indigo-800 transition-colors">
              <div className="w-6 h-6 bg-indigo-700 rounded-lg flex items-center justify-center text-indigo-300 text-xs font-bold group-hover:text-amber-400 transition-colors">
                {i + 1}
              </div>
              <p className="text-indigo-100 font-medium leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
