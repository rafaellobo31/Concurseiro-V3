import { Link } from 'react-router-dom';
import { Play, Sparkles, Trophy, Target } from 'lucide-react';
import { motion } from 'motion/react';

export function DashboardEmptyState({ userName }: { userName?: string }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-indigo-100/50 p-8 md:p-16 text-center space-y-10 relative overflow-hidden"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Bem-vindo ao Concurseiro V3
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Olá, {userName}! 👋 <br />
            <span className="text-indigo-600">Vamos começar sua jornada?</span>
          </h1>
          
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
            Seu dashboard inteligente está pronto, mas ainda não temos dados para analisar. 
            Realize seu primeiro simulado para desbloquear estatísticas, insights da IA e acompanhar sua evolução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Target, title: 'Foco Total', desc: 'Simulados personalizados' },
            { icon: Trophy, title: 'Rankings', desc: 'Compare seu desempenho' },
            { icon: Sparkles, title: 'Mentor IA', desc: 'Análise de erros em tempo real' },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
              <item.icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <Link
            to="/simulados"
            className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            Fazer Meu Primeiro Simulado
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
