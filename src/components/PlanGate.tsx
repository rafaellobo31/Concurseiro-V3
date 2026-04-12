import { ReactNode, useState } from 'react';
import { usePlan } from '../hooks/usePlan';
import { FeatureName } from '../services/planService';
import { UpgradeModal } from './UpgradeModal';
import { Lock, Crown, Loader2 } from 'lucide-react';

interface PlanGateProps {
  children: ReactNode;
  feature: FeatureName;
  fallback?: ReactNode;
  showBadge?: boolean;
}

export function PlanGate({ children, feature, fallback, showBadge = false }: PlanGateProps) {
  const { canAccessFeature, loading } = usePlan();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 animate-pulse">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
        <p className="text-slate-400 text-sm font-medium">Verificando acesso...</p>
      </div>
    );
  }

  const hasAccess = canAccessFeature(feature);

  if (hasAccess) {
    return (
      <div className="relative">
        {children}
        {showBadge && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
              <Crown className="w-3 h-3" />
              Pro
            </div>
          </div>
        )}
      </div>
    );
  }

  if (fallback) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none select-none filter blur-[1px]">
          {fallback}
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-3xl border-2 border-dashed border-amber-200">
          <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-amber-100 max-w-[280px]">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Recurso Premium</h3>
            <p className="text-sm text-gray-600 mb-6">
              Este recurso está disponível apenas para assinantes Pro.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 px-4 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              Fazer Upgrade
            </button>
          </div>
        </div>
        <UpgradeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          featureName={feature.replace(/_/g, ' ')}
        />
      </div>
    );
  }

  return (
    <div className="p-8 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-amber-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        O recurso <span className="font-bold text-gray-900 italic">"{feature.replace(/_/g, ' ')}"</span> faz parte do plano Pro. Faça o upgrade agora para liberar acesso total.
      </p>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="py-4 px-8 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-900/20"
      >
        Ver Planos Pro
      </button>
      <UpgradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        featureName={feature.replace(/_/g, ' ')}
      />
    </div>
  );
}
