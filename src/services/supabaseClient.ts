import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logs for environment variables
if (supabaseUrl && supabaseAnonKey) {
  console.log('[Supabase] Variáveis encontradas. Inicializando client...');
} else {
  console.warn('[Supabase] Variáveis não encontradas ou incompletas. O app funcionará em modo fallback (local).');
  if (!supabaseUrl) console.log('[Supabase] VITE_SUPABASE_URL está ausente.');
  if (!supabaseAnonKey) console.log('[Supabase] VITE_SUPABASE_ANON_KEY está ausente.');
}

// Only initialize if variables are present to avoid console errors in preview
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here') 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  : null;

if (supabase) {
  console.log('[Supabase] Client inicializado com sucesso.');
} else {
  console.log('[Supabase] Client não inicializado (modo fallback ativo).');
}

export const isSupabaseConfigured = !!supabase;
