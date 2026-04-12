import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  planLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthProvider] Inicializando AuthProvider...');
    
    let isMounted = true;
    let authInitialized = false;

    // Initial session check
    async function initAuth() {
      if (authInitialized) return;
      
      console.log('[AuthProvider] Iniciando initAuth...');
      const safetyTimeout = setTimeout(() => {
        if (isMounted) {
          console.warn('[AuthProvider] Safety timeout atingido! Forçando loading false.');
          setLoading(false);
          setPlanLoading(false);
        }
      }, 10000);

      try {
        const currentUser = await authService.getCurrentUser();
        
        if (isMounted) {
          console.log('[AuthProvider] initAuth concluído. Usuário:', currentUser?.id || 'null', 'Plano:', currentUser?.plan || 'N/A');
          setUser(currentUser);
          authInitialized = true;
        }
      } catch (error) {
        console.error('[AuthProvider] Erro no initAuth:', error);
      } finally {
        clearTimeout(safetyTimeout);
        if (isMounted) {
          console.log('[AuthProvider] Finalizando loading no initAuth.');
          setLoading(false);
          setPlanLoading(false);
        }
      }
    }

    initAuth();

    // Listen for changes
    const unsubscribe = authService.onAuthStateChange((updatedUser) => {
      if (isMounted) {
        console.log('[AuthProvider] Mudança de estado detectada. Novo usuário:', updatedUser?.id || 'null', 'Plano:', updatedUser?.plan || 'N/A');
        
        // Se já inicializamos e o usuário é o mesmo, talvez não precisemos resetar o loading
        // Mas se for um novo login ou logout, atualizamos
        setUser(updatedUser);
        
        if (!authInitialized) {
          authInitialized = true;
          console.log('[AuthProvider] Auth inicializado via onAuthStateChange.');
        }
        
        setLoading(false);
        setPlanLoading(false);
      }
    });

    return () => {
      console.log('[AuthProvider] Desmontando AuthProvider...');
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: signedInUser, error } = await authService.signIn(email, password);
    if (!error) setUser(signedInUser);
    return { error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { user: signedUpUser, error } = await authService.signUp(email, password, name);
    if (!error) setUser(signedUpUser);
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    console.log('[AuthProvider] refreshUser chamado. Plano atual:', user?.plan || 'free');
    setPlanLoading(true);
    try {
      const updatedUser = await authService.refreshUser();
      console.log('[AuthProvider] refreshUser concluído. Novo plano:', updatedUser?.plan || 'free');
      setUser(updatedUser);
    } finally {
      setPlanLoading(false);
      console.log('[AuthProvider] Estado global atualizado com sucesso.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, planLoading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
