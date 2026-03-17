import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MOCK_USER } from '../mocks/data';
import { User } from '../types';

export const userService = {
  async getProfile(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return MOCK_USER;
    }

    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return data as User;
  }
};
