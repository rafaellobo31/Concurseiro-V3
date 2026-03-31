import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MOCK_USER } from '../mocks/data';
import { User } from '../types';

export const userService = {
  async getProfile(userId: string): Promise<User | null> {
    console.log('[UserService] getProfile iniciado para:', userId);
    if (!isSupabaseConfigured) {
      console.log('[UserService] Supabase não configurado, retornando MOCK_USER.');
      return MOCK_USER;
    }

    try {
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('[UserService] Erro ao buscar perfil no Supabase:', error.message);
        return null;
      }
      
      console.log('[UserService] Perfil encontrado no Supabase:', data?.plan || 'free');
      return data as User;
    } catch (err) {
      console.error('[UserService] Erro inesperado ao buscar perfil:', err);
      return null;
    }
  }
};
