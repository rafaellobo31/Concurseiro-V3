import { User } from '../types';

export type FeatureName = 
  | 'generate_exam' 
  | 'edital_mode' 
  | 'full_correction' 
  | 'advanced_dashboard' 
  | 'pedagogical_review'
  | 'study_plan_pro';

export const planService = {
  getUserPlan(user: User | null): 'free' | 'pro' {
    if (!user) return 'free';
    return user.plan || 'free';
  },

  isFree(user: User | null): boolean {
    return this.getUserPlan(user) === 'free';
  },

  isPro(user: User | null): boolean {
    return this.getUserPlan(user) === 'pro';
  },

  canAccessFeature(user: User | null, feature: FeatureName): boolean {
    if (this.isPro(user)) return true;

    // Free plan restrictions
    switch (feature) {
      case 'generate_exam': return true; // Limited by count elsewhere
      case 'edital_mode': return false;
      case 'full_correction': return false;
      case 'advanced_dashboard': return false;
      case 'study_plan_pro': return false;
      case 'pedagogical_review': return true; // Allowed for now
      default: return false;
    }
  },

  maxQuestions(user: User | null): number {
    return this.isPro(user) ? 100 : 4;
  },

  canGenerateExam(user: User | null, questionCount: number): boolean {
    if (this.isPro(user)) return true;
    return questionCount <= this.maxQuestions(user);
  },

  canUseEditalMode(user: User | null): boolean {
    return this.isPro(user);
  },

  canViewFullCorrection(user: User | null): boolean {
    return this.isPro(user);
  },

  canViewAdvancedDashboard(user: User | null): boolean {
    return this.isPro(user);
  }
};
