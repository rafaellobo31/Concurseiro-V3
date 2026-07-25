import { User } from '../types';

export type FeatureName = 
  | 'generate_exam' 
  | 'edital_mode' 
  | 'full_correction' 
  | 'advanced_dashboard' 
  | 'pedagogical_review'
  | 'study_plan_pro';

export type PlanState = 'loading' | 'free' | 'pro';

export const planService = {
  getUserPlan(user: User | null, isLoading: boolean = false): PlanState {
    if (isLoading) return 'loading';
    if (!user) return 'free';
    if (!user.plan) return 'loading';
    return user.plan === 'pro' ? 'pro' : 'free';
  },

  isUnknown(user: User | null, isLoading: boolean = false): boolean {
    return this.getUserPlan(user, isLoading) === 'loading';
  },

  isFree(user: User | null, isLoading: boolean = false): boolean {
    return this.getUserPlan(user, isLoading) === 'free';
  },

  isPro(user: User | null, isLoading: boolean = false): boolean {
    return this.getUserPlan(user, isLoading) === 'pro';
  },

  canAccessFeature(user: User | null, feature: FeatureName, isLoading: boolean = false): boolean {
    // Se estiver em estado carregando/desconhecido, permitir temporariamente sem bloqueio prévio
    if (this.isUnknown(user, isLoading)) {
      return true;
    }
    if (this.isPro(user, isLoading)) return true;

    // Restrições do plano Free
    switch (feature) {
      case 'generate_exam': return true; // Limitado pela quantidade de questões
      case 'edital_mode': return false;
      case 'full_correction': return false;
      case 'advanced_dashboard': return false;
      case 'study_plan_pro': return false;
      case 'pedagogical_review': return true;
      default: return false;
    }
  },

  maxQuestions(user: User | null, isLoading: boolean = false): number {
    return this.isPro(user, isLoading) ? 100 : 4;
  },

  canGenerateExam(user: User | null, questionCount: number, isLoading: boolean = false): boolean {
    if (this.isUnknown(user, isLoading) || this.isPro(user, isLoading)) return true;
    return questionCount <= this.maxQuestions(user, isLoading);
  },

  canUseEditalMode(user: User | null, isLoading: boolean = false): boolean {
    if (this.isUnknown(user, isLoading)) return true;
    return this.isPro(user, isLoading);
  },

  canViewFullCorrection(user: User | null, isLoading: boolean = false): boolean {
    if (this.isUnknown(user, isLoading)) return true;
    return this.isPro(user, isLoading);
  },

  canViewAdvancedDashboard(user: User | null, isLoading: boolean = false): boolean {
    if (this.isUnknown(user, isLoading)) return true;
    return this.isPro(user, isLoading);
  }
};
