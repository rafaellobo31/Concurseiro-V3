import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

interface StrengthsCardProps {
  strengths: string[];
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <Zap className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-emerald-900 uppercase tracking-tight">Pontos Fortes</h3>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          {strengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 font-medium leading-relaxed">{strength}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
