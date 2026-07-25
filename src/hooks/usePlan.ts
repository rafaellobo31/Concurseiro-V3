import { useAuth } from './useAuth';
import { planService, FeatureName, PlanState } from '../services/planService';

export function usePlan() {
  const { user, planLoading, loading } = useAuth();
  const isLoading = loading || planLoading;

  const planState: PlanState = planService.getUserPlan(user, isLoading);
  const isUnknown = planState === 'loading';
  const isFree = planState === 'free';
  const isPro = planState === 'pro';

  if (isUnknown) {
    console.log('[PlanGate] Plano carregando');
  } else {
    console.log(`[usePlan] Plano resolvido. Usuário: ${user?.id || 'null'}, Plano: ${planState}`);
    if (isPro) {
      console.log('[PlanGate] Plano resolvido: pro');
      console.log('[PlanGate] Acesso ao edital: permitido');
    } else {
      console.log('[PlanGate] Plano resolvido: free');
    }
  }

  return {
    plan: planState,
    isUnknown,
    isFree,
    isPro,
    loading: isLoading,
    maxQuestions: planService.maxQuestions(user, isLoading),
    canAccessFeature: (feature: FeatureName) => planService.canAccessFeature(user, feature, isLoading),
    canGenerateExam: (count: number) => planService.canGenerateExam(user, count, isLoading),
    canUseEditalMode: () => planService.canUseEditalMode(user, isLoading),
    canViewFullCorrection: () => planService.canViewFullCorrection(user, isLoading),
    canViewAdvancedDashboard: () => planService.canViewAdvancedDashboard(user, isLoading)
  };
}
