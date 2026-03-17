import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MOCK_USER } from '../mocks/data';
import { User } from '../types';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      // In mock mode, we check if there's a "mock_session" in localStorage
      const hasSession = localStorage.getItem('mock_session') === 'true';
      if (!hasSession) return null;
      
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_USER;
    }

    const { data: { user }, error } = await supabase!.auth.getUser();
    if (error || !user) return null;

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.full_name || user.email!.split('@')[0],
      isPro: false,
    };
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    if (!isSupabaseConfigured) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Mock success for any email/pass
      localStorage.setItem('mock_session', 'true');
      return { user: MOCK_USER, error: null };
    }

    const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error };

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.full_name || data.user.email!.split('@')[0],
      isPro: false,
    };

    return { user, error: null };
  },

  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: any }> {
    if (!isSupabaseConfigured) {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('mock_session', 'true');
      return { user: { ...MOCK_USER, name, email }, error: null };
    }

    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) return { user: null, error };
    if (!data.user) return { user: null, error: new Error('Signup failed') };

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.full_name || data.user.email!.split('@')[0],
      isPro: false,
    };

    return { user, error: null };
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('mock_session');
      return;
    }
    await supabase!.auth.signOut();
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isSupabaseConfigured) {
      // For mock mode, we don't have a real listener, but we can return a dummy unsubscribe
      return () => {};
    }

    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name || session.user.email!.split('@')[0],
          isPro: false,
        });
      } else {
        callback(null);
      }
    });

    return () => subscription.unsubscribe();
  }
};
