import { CheckCircle2, Star, Zap, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface CurrentPlanCardProps {
  plan: 'free' | 'pro';
}

export const CurrentPlanCard = ({ plan }: CurrentPlanCardProps) => {
  const isPro = plan === 'pro';
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleManageSubscription = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão do portal');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Não foi possível abrir o portal de gerenciamento. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`p-6 rounded-2xl border-2 transition-all ${
        isPro 
          ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              Plano Atual: {isPro ? 'Pro' : 'Free'}
            </h3>
            {isPro && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">
            {isPro 
              ? "Acesso completo a todos os recursos inteligentes da plataforma."
              : "Acesso inicial para explorar a plataforma."}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${isPro ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {isPro ? <Zap size={24} fill="currentColor" /> : <Zap size={24} />}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recursos ativos</h4>
          <ul className="grid grid-cols-1 gap-2">
            {(isPro ? proFeatures : freeFeatures).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className={isPro ? 'text-indigo-500' : 'text-emerald-500'} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {isPro && (
          <div className="pt-2 border-t border-indigo-100">
            <button 
              onClick={handleManageSubscription}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-indigo-100/50 text-indigo-600 border border-indigo-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
              ) : (
                <Settings size={16} />
              )}
              Gerenciar Assinatura
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const freeFeatures = [
  'Simulados curtos',
  'Histórico básico',
  'Acesso inicial à plataforma',
];

const proFeatures = [
  'Simulados completos',
  'Revisão pedagógica completa',
  'Dashboard avançado',
  'Plano de estudos completo',
  'Simulados por edital premium',
];
