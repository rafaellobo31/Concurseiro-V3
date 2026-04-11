import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { User } from '../types';
import { ProfileHeaderCard } from '../components/ProfileHeaderCard';
import { CurrentPlanCard } from '../components/CurrentPlanCard';
import { UpgradeCard } from '../components/UpgradeCard';
import { SubscriptionDetailsCard } from '../components/SubscriptionDetailsCard';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const isCheckoutSuccess = searchParams.get('checkout') === 'success';

  useEffect(() => {
    async function loadProfile() {
      if (!authUser?.id) return;
      
      try {
        setLoading(true);
        const data = await profileService.getCurrentUserProfile(authUser.id);
        if (data) {
          setProfile(data);
          
          // Se acabamos de voltar de um checkout bem-sucedido, mas o plano ainda é free,
          // podemos tentar recarregar após um pequeno delay para dar tempo ao webhook.
          if (isCheckoutSuccess && data.plan === 'free') {
            console.log('Checkout success detected but plan is still free. Retrying in 3s...');
            setTimeout(loadProfile, 3000);
          } else if (isCheckoutSuccess && data.plan === 'pro') {
            setShowSuccessMessage(true);
            // Atualiza o estado global para que outras partes da aplicação reconheçam o plano Pro
            console.log('[ProfilePage] Plano Pro detectado após checkout. Atualizando estado global...');
            refreshUser();
          }
        } else {
          setError('Não foi possível carregar os dados do perfil.');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Ocorreu um erro ao carregar seu perfil.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [authUser?.id, isCheckoutSuccess]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Carregando seu perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center max-w-md mx-auto px-6">
        <div className="p-4 bg-red-50 text-red-600 rounded-full">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Ops! Algo deu errado.</h2>
          <p className="text-slate-600">{error || 'Não conseguimos encontrar seus dados.'}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Meu Perfil</h1>
        <p className="text-slate-500">Gerencie sua conta e plano de estudos.</p>
      </motion.div>

      {showSuccessMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-4 text-emerald-800"
        >
          <div className="bg-emerald-500 text-white p-2 rounded-full">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="font-bold">Assinatura Ativada!</h3>
            <p className="text-sm opacity-90">Parabéns! Você agora é um usuário Pro e tem acesso a todos os recursos.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <ProfileHeaderCard user={profile} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CurrentPlanCard plan={profile.plan || 'free'} />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <UpgradeCard isPro={profile.plan === 'pro'} />
            
            {profile.plan === 'pro' && (
              <SubscriptionDetailsCard user={profile} />
            )}
            
            {profile.plan === 'pro' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Suporte Premium</h3>
                  <p className="text-slate-600">
                    Como usuário Pro, você tem acesso prioritário ao nosso time de suporte.
                  </p>
                </div>
                <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all">
                  Falar com suporte
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
