import { Link } from 'react-router-dom';
import { Play, History, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { usePlan } from '../../hooks/usePlan';
import { useState } from 'react';
import { UpgradeModal } from '../UpgradeModal';

export function QuickActionsCard() {
  const { isPro } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const actions = [
    { label: 'Novo Simulado', icon: Play, to: '/simulados', color: 'bg-indigo-600 text-white', hover: 'hover:bg-indigo-700' },
    { label: 'Ver Histórico', icon: History, to: '/history', color: 'bg-white text-gray-700 border border-gray-100', hover: 'hover:bg-gray-50' },
    { label: 'Plano de Estudos', icon: Calendar, to: '/study-plan', color: 'bg-white text-gray-700 border border-gray-100', hover: 'hover:bg-gray-50' },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Ações Rápidas</h3>
        <div className="space-y-3">
          {actions.map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.to}
                className={`flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all shadow-sm ${action.color} ${action.hover}`}
              >
                <div className="flex items-center gap-3">
                  <action.icon className="w-5 h-5" />
                  {action.label}
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            </motion.div>
          ))}

          {!isPro && (
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUpgrade(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all shadow-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Seja Pro
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </motion.button>
          )}
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        featureName="Acesso Ilimitado"
      />
    </>
  );
}

