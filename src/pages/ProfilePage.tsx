import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import { User } from '../types';
import { ProfileHeaderCard } from '../components/ProfileHeaderCard';
import { CurrentPlanCard } from '../components/CurrentPlanCard';
import { UpgradeCard } from '../components/UpgradeCard';
import { motion } from 'motion/react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!authUser?.id) return;
      
      try {
        setLoading(true);
        const data = await profileService.getCurrentUserProfile(authUser.id);
        if (data) {
          setProfile(data);
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
  }, [authUser?.id]);

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

      <div className="grid grid-cols-1 gap-8">
        <ProfileHeaderCard user={profile} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CurrentPlanCard plan={profile.plan || 'free'} />
          </div>
          
          <div className="lg:col-span-2">
            <UpgradeCard isPro={profile.plan === 'pro'} />
            
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
