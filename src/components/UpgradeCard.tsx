import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface UpgradeCardProps {
  isPro: boolean;
}

export const UpgradeCard = ({ isPro }: UpgradeCardProps) => {
  const [showModal, setShowModal] = useState(false);

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
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 group"
            >
              Seja Pro agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Em breve disponível!</h3>
              <p className="text-slate-600">
                Estamos preparando a melhor experiência de assinatura para você. 
                Fique atento às novidades!
              </p>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Entendido
            </button>
          </motion.div>
        </div>
      )}
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
