import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Check, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl"
        >
          {/* Header Background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-amber-400 to-orange-500" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative pt-12 pb-8 px-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <Crown className="w-12 h-12 text-amber-500" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {featureName ? `Libere o ${featureName}` : 'Seja Pro no Concurseiro'}
              </h2>
              <p className="text-gray-600">
                Acelere sua aprovação com recursos exclusivos e simulados ilimitados.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                'Simulados de até 50 questões',
                'Dashboard de desempenho avançado',
                'Plano de estudos inteligente completo',
                'Simulados por edital ilimitados',
                'Revisão pedagógica com IA'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button className="w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-900/20">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                Fazer Upgrade Agora
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 px-6 text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Talvez mais tarde
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
