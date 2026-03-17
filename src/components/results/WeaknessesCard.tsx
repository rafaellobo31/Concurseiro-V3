import React from 'react';
import { AlertCircle, Target } from 'lucide-react';

interface WeaknessesCardProps {
  weaknesses: string[];
}

export function WeaknessesCard({ weaknesses }: WeaknessesCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-red-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
          <Target className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-red-900 uppercase tracking-tight">Pontos Fracos</h3>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          {weaknesses.map((weakness, i) => (
            <li key={i} className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 font-medium leading-relaxed">{weakness}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
