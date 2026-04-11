import { useAuth } from './useAuth';
import { planService } from '../services/planService';

export function usePlan() {
  const { user } = useAuth();

  const plan = planService.getUserPlan(user);
  const isFree = planService.isFree(user);
  const isPro = planService.isPro(user);

  console.log(`[usePlan] Reavaliando plano. Usuário: ${user?.id || 'null'}, Plano: ${plan}`);

  return {
    plan,
    isFree,
    isPro,
    maxQuestions: planService.maxQuestions(user),
    canAccessFeature: (feature: any) => planService.canAccessFeature(user, feature),
    canGenerateExam: (count: number) => planService.canGenerateExam(user, count),
    canUseEditalMode: () => planService.canUseEditalMode(user),
    canViewFullCorrection: () => planService.canViewFullCorrection(user),
    canViewAdvancedDashboard: () => planService.canViewAdvancedDashboard(user)
  };
}
