import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MOCK_USER } from '../mocks/data';
import { User } from '../types';
import { userService } from './userService';

let cachedUser: User | null = null;
let isInitializing = false;

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    console.log('[AuthService] getCurrentUser iniciado. Supabase configurado:', isSupabaseConfigured);
    
    if (cachedUser) {
      console.log('[AuthService] Retornando usuário do cache:', cachedUser.id);
      return cachedUser;
    }

    if (!isSupabaseConfigured) {
      const hasSession = localStorage.getItem('mock_session') === 'true';
      console.log('[AuthService] Modo demonstração. Sessão ativa:', hasSession);
      if (!hasSession) {
        console.log('[AuthService] Nenhuma sessão de demonstração encontrada.');
        return null;
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('[AuthService] Retornando MOCK_USER.');
      cachedUser = MOCK_USER;
      return MOCK_USER;
    }

    try {
      console.log('[AuthService] Chamando supabase.auth.getUser()...');
      // Use a timeout for getUser too
      const getUserPromise = supabase!.auth.getUser();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao obter usuário Supabase')), 5000)
      );
      
      const { data: { user }, error } = await Promise.race([getUserPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('[AuthService] Erro ao obter usuário Supabase:', error);
        return null;
      }
      
      if (!user) {
        console.log('[AuthService] Nenhum usuário logado no Supabase (getUser retornou null).');
        cachedUser = null;
        return null;
      }

      console.log('[AuthService] Usuário Supabase encontrado:', user.id);

      // Fetch profile to get plan and other custom data
      console.log('[AuthService] Iniciando busca de profile para:', user.id);
      let profile = null;
      try {
        // Add a safety timeout for profile fetch
        const profilePromise = userService.getProfile(user.id);
        const pTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout ao carregar perfil')), 5000)
        );
        
        profile = await Promise.race([profilePromise, pTimeoutPromise]) as any;
        console.log('[AuthService] Profile carregado com sucesso:', profile?.plan || 'free');
      } catch (pError) {
        console.error('[AuthService] Erro ou timeout ao carregar perfil, usando fallback free:', pError);
      }

      const processedUser: User = {
        id: user.id,
        email: user.email!,
        name: profile?.name || user.user_metadata.full_name || user.email!.split('@')[0],
        plan: profile?.plan || 'free',
        isPro: profile?.plan === 'pro',
        avatarUrl: profile?.avatarUrl,
      };

      console.log('[AuthService] Usuário definido no estado (getCurrentUser):', processedUser.id, 'Plano:', processedUser.plan);
      cachedUser = processedUser;
      return processedUser;
    } catch (err) {
      console.error('[AuthService] Erro inesperado em getCurrentUser:', err);
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    console.log('[AuthService] Início do login para:', email);
    
    if (!isSupabaseConfigured) {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('mock_session', 'true');
      console.log('[AuthService] Login de demonstração bem-sucedido.');
      return { user: MOCK_USER, error: null };
    }

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[AuthService] Erro no login Supabase:', error);
        return { user: null, error };
      }

      console.log('[AuthService] Login Supabase bem-sucedido:', data.user.id);

      let profile = null;
      try {
        profile = await userService.getProfile(data.user.id);
      } catch (pError) {
        console.error('[AuthService] Erro ao carregar perfil no login:', pError);
      }

      const processedUser: User = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata.full_name || data.user.email!.split('@')[0],
        plan: profile?.plan || 'free',
        isPro: profile?.plan === 'pro',
        avatarUrl: profile?.avatarUrl,
      };

      console.log('[AuthService] Usuário processado após login:', processedUser.plan);
      cachedUser = processedUser;
      return { user: processedUser, error: null };
    } catch (err) {
      console.error('[AuthService] Erro inesperado no signIn:', err);
      return { user: null, error: err };
    }
  },

  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: any }> {
    console.log('[AuthService] Início do cadastro para:', email);
    
    if (!isSupabaseConfigured) {
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('mock_session', 'true');
      console.log('[AuthService] Cadastro de demonstração bem-sucedido.');
      return { user: { ...MOCK_USER, name, email }, error: null };
    }

    try {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });

      if (error) {
        console.error('[AuthService] Erro no cadastro Supabase:', error);
        return { user: null, error };
      }
      
      if (!data.user) {
        console.error('[AuthService] Cadastro retornou usuário nulo.');
        return { user: null, error: new Error('Signup failed') };
      }

      console.log('[AuthService] Cadastro Supabase bem-sucedido:', data.user.id);

      let profile = null;
      try {
        profile = await userService.getProfile(data.user.id);
      } catch (pError) {
        console.error('[AuthService] Erro ao carregar perfil no cadastro:', pError);
      }

      const processedUser: User = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata.full_name || data.user.email!.split('@')[0],
        plan: profile?.plan || 'free',
        isPro: profile?.plan === 'pro',
        avatarUrl: profile?.avatarUrl,
      };

      console.log('[AuthService] Usuário processado após cadastro:', processedUser.plan);
      cachedUser = processedUser;
      return { user: processedUser, error: null };
    } catch (err) {
      console.error('[AuthService] Erro inesperado no signUp:', err);
      return { user: null, error: err };
    }
  },

  async signOut() {
    console.log('[AuthService] Realizando logout.');
    cachedUser = null;
    if (!isSupabaseConfigured) {
      localStorage.removeItem('mock_session');
      return;
    }
    await supabase!.auth.signOut();
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isSupabaseConfigured) {
      console.log('[AuthService] onAuthStateChange: Supabase não configurado, ignorando.');
      return () => {};
    }

    console.log('[AuthService] Configurando listener onAuthStateChange...');
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthService] Evento de autenticação detectado:', event);
      
      if (session?.user) {
        console.log('[AuthService] Sessão ativa encontrada no evento:', session.user.id);
        
        console.log('[AuthService] Iniciando busca de profile no evento para:', session.user.id);
        let profile = null;
        try {
          // Add a safety timeout for profile fetch
          const profilePromise = userService.getProfile(session.user.id);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout ao carregar perfil')), 5000)
          );
          
          profile = await Promise.race([profilePromise, timeoutPromise]) as any;
          console.log('[AuthService] Profile carregado no evento:', profile?.plan || 'free');
        } catch (pError) {
          console.error('[AuthService] Erro ou timeout ao carregar perfil no evento, usando fallback free:', pError);
        }

        const processedUser: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata.full_name || session.user.email!.split('@')[0],
          plan: profile?.plan || 'free',
          isPro: profile?.plan === 'pro',
          avatarUrl: profile?.avatarUrl,
        };

        console.log('[AuthService] Chamando callback com usuário:', processedUser.id, 'Plano:', processedUser.plan);
        cachedUser = processedUser;
        callback(processedUser);
      } else {
        console.log('[AuthService] Nenhuma sessão ativa no evento (session.user é null).');
        cachedUser = null;
        callback(null);
      }
    });

    return () => {
      console.log('[AuthService] Removendo listener onAuthStateChange.');
      subscription.unsubscribe();
    };
  }
};

