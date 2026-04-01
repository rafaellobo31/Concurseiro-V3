import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface UpgradeCardProps {
  isPro: boolean;
}

export const UpgradeCard = ({ isPro }: UpgradeCardProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão de checkout');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Não foi possível iniciar o checkout. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (isPro) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Evolua para o Plano Pro</h2>
            <p className="text-slate-400 text-lg max-w-lg">
              Desbloqueie todo o potencial da nossa inteligência artificial e acelere sua aprovação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-300">
                <div className="bg-indigo-500/20 p-1 rounded-full text-indigo-400">
                  <Check size={16} />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Seja Pro agora
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const proBenefits = [
  'Mais questões por simulado',
  'Acesso completo ao dashboard inteligente',
  'Revisão detalhada das questões',
  'Simulados por edital avançados',
  'Plano de estudos completo',
  'Suporte prioritário',
];
