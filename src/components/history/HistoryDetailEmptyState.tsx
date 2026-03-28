import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const HistoryDetailEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100">
        <AlertCircle className="w-10 h-10 text-amber-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Detalhes não encontrados</h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Não foi possível carregar os detalhes deste simulado. Isso pode acontecer se o simulado for muito antigo ou se houve um erro na persistência.
      </p>
      <button
        onClick={() => navigate('/history')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para o Histórico
      </button>
    </div>
  );
};
