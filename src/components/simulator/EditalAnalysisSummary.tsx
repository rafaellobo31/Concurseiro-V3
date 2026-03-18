import { EditalAnalysis } from '../../types/edital';
import { motion } from 'motion/react';
import { CheckCircle2, Landmark, User, GraduationCap, BookOpen, ListChecks, Info, AlertTriangle } from 'lucide-react';

interface EditalAnalysisSummaryProps {
  analysis: EditalAnalysis;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EditalAnalysisSummary({ analysis, onConfirm, onCancel }: EditalAnalysisSummaryProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="text-emerald-600 w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Análise Concluída</h3>
            <p className="text-sm text-gray-500">Confirme os dados extraídos do edital</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Landmark className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Concurso / Órgão</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{analysis.concurso || 'Não identificado'}</p>
            <p className="text-xs text-gray-500">{analysis.orgao || 'Não identificado'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <User className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Cargo / Área</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{analysis.cargo || 'Não identificado'}</p>
            <p className="text-xs text-gray-500">Banca: {analysis.banca || 'Não identificada'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Escolaridade</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{analysis.escolaridade || 'Não identificada'}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Matérias Identificadas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.materias.slice(0, 4).map((m, i) => (
                <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100">
                  {m.nome}
                </span>
              ))}
              {analysis.materias.length > 4 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg border border-gray-100">
                  +{analysis.materias.length - 4} mais
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Observations */}
        {analysis.observacoes && analysis.observacoes.length > 0 && (
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Observações Estratégicas</span>
            </div>
            <ul className="space-y-2">
              {analysis.observacoes.map((obs, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
                  {obs}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Priorities */}
        {analysis.prioridades && analysis.prioridades.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Prioridades de Estudo</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.prioridades.map((p, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-gray-100 flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-900 truncate">{p.materia}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    p.peso === 'alto' ? 'text-red-500' : p.peso === 'médio' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    Peso {p.peso}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-400">
            <ListChecks className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Tópicos por Matéria</span>
          </div>
          <div className="space-y-4">
            {analysis.materias.slice(0, 3).map((m, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700">{m.nome}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {m.topicos.map((t, j) => (
                    <div key={j} className="flex items-start gap-2 p-2 bg-gray-50/50 rounded-lg text-[11px] text-gray-600">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={onConfirm}
          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          Confirmar e Gerar Simulado
        </button>
        <button
          onClick={onCancel}
          className="px-8 py-4 bg-white text-gray-500 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all"
        >
          Refazer Upload
        </button>
      </div>
    </div>
  );
}
