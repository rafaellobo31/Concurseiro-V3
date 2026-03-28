import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  BookOpen,
  ArrowRight,
  Award,
  Zap,
  Brain
} from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardAnalytics } from '../../services/dashboardAnalyticsService';

interface IntelligentAnalyticsV2Props {
  analytics: DashboardAnalytics;
}

export function IntelligentAnalyticsV2({ analytics }: IntelligentAnalyticsV2Props) {
  const { visaoGeral, desempenhoPorMateria, assuntosCriticos, pontosFortes, pontosFracos, recomendacao } = analytics;

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'melhora': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'queda': return <TrendingDown className="w-4 h-4 text-rose-500" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'melhora': return 'text-emerald-600 bg-emerald-50';
      case 'queda': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Visão Geral Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getTendenciaColor(visaoGeral.tendencia)} flex items-center gap-1`}>
              {getTendenciaIcon(visaoGeral.tendencia)}
              {visaoGeral.tendencia}
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total de Simulados</p>
          <h3 className="text-3xl font-black text-slate-900">{visaoGeral.totalSimulados}</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Média Geral</p>
          <h3 className="text-3xl font-black text-slate-900">{visaoGeral.mediaGeral.toFixed(1)}%</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Melhor Resultado</p>
          <h3 className="text-3xl font-black text-slate-900">{visaoGeral.melhorResultado.toFixed(1)}%</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pior Resultado</p>
          <h3 className="text-3xl font-black text-slate-900">{visaoGeral.piorResultado.toFixed(1)}%</h3>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Desempenho por Matéria */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Desempenho por Matéria</h3>
                <p className="text-sm text-slate-500 font-medium">Ranking de aproveitamento por disciplina.</p>
              </div>
              <Zap className="w-6 h-6 text-indigo-500" />
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={desempenhoPorMateria} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    dataKey="materia" 
                    type="category" 
                    width={120} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="percentual" radius={[0, 4, 4, 0]} barSize={20}>
                    {desempenhoPorMateria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.percentual >= 70 ? '#10b981' : entry.percentual >= 50 ? '#6366f1' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assuntos Críticos */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Assuntos Críticos</h3>
                <p className="text-sm text-slate-500 font-medium">Tópicos que exigem atenção imediata.</p>
              </div>
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>

            <div className="space-y-4">
              {assuntosCriticos.map((assunto, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 font-bold shadow-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{assunto.assunto}</p>
                      <p className="text-xs text-slate-500 font-medium">{assunto.erros} erros registrados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-rose-600">{assunto.percentual.toFixed(0)}%</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Aproveitamento</p>
                  </div>
                </div>
              ))}
              {assuntosCriticos.length === 0 && (
                <p className="text-center py-8 text-slate-400 italic">Nenhum assunto crítico identificado ainda.</p>
              )}
            </div>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="space-y-8">
          {/* Recomendação Automática */}
          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-indigo-300" />
                <h3 className="font-black uppercase tracking-widest text-xs text-indigo-200">Insight Estratégico</h3>
              </div>
              <p className="text-lg font-medium leading-relaxed mb-8">
                "{recomendacao}"
              </p>
              <button className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors">
                Ver Plano de Estudos
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          </div>

          {/* Pontos Fortes e Fracos */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                <CheckCircle2 className="w-4 h-4" />
                Pontos Fortes
              </div>
              <div className="flex flex-wrap gap-2">
                {pontosFortes.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                    {p}
                  </span>
                ))}
                {pontosFortes.length === 0 && <p className="text-slate-400 text-xs italic">Ainda não identificados.</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-black uppercase tracking-widest text-[10px]">
                <AlertCircle className="w-4 h-4" />
                Onde Melhorar
              </div>
              <div className="flex flex-wrap gap-2">
                {pontosFracos.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold border border-rose-100">
                    {p}
                  </span>
                ))}
                {pontosFracos.length === 0 && <p className="text-slate-400 text-xs italic">Ainda não identificados.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
