import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MOCK_USER } from '../mocks/data';
import { User } from '../types';

export const profileService = {
  async getCurrentUserProfile(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return {
        ...MOCK_USER,
        plan: 'free',
        createdAt: new Date().toISOString()
      };
    }

    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      isPro: data.plan === 'pro',
      avatarUrl: data.avatar_url,
      plan: data.plan || 'free',
      stripe_customer_id: data.stripe_customer_id,
      subscriptionStatus: data.subscription_status,
      subscriptionCurrentPeriodEnd: data.subscription_current_period_end,
      createdAt: data.created_at
    } as User;
  }
};
