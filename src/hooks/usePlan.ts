import { useAuth } from './useAuth';
import { planService } from '../services/planService';

export function usePlan() {
  const { user, planLoading } = useAuth();

  const plan = planService.getUserPlan(user);
  const isFree = planService.isFree(user);
  const isPro = planService.isPro(user);

  if (!planLoading) {
    console.log(`[usePlan] Plano resolvido. Usuário: ${user?.id || 'null'}, Plano: ${plan}`);
  }

  return {
    plan,
    isFree,
    isPro,
    loading: planLoading,
    maxQuestions: planService.maxQuestions(user),
    canAccessFeature: (feature: any) => planService.canAccessFeature(user, feature),
    canGenerateExam: (count: number) => planService.canGenerateExam(user, count),
    canUseEditalMode: () => planService.canUseEditalMode(user),
    canViewFullCorrection: () => planService.canViewFullCorrection(user),
    canViewAdvancedDashboard: () => planService.canViewAdvancedDashboard(user)
  };
}
