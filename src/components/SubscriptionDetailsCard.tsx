import { Calendar, CreditCard, Info, Settings, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { User } from '../types';

interface SubscriptionDetailsCardProps {
  user: User;
}

export const SubscriptionDetailsCard = ({ user }: SubscriptionDetailsCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!user.id) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão do portal');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Não foi possível abrir o portal de gerenciamento. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (user.plan !== 'pro') return null;

  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: 'Ativa', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    trialing: { label: 'Degustação', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    past_due: { label: 'Pagamento Pendente', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    canceled: { label: 'Cancelada', color: 'text-slate-600 bg-slate-50 border-slate-100' },
    incomplete: { label: 'Incompleta', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    incomplete_expired: { label: 'Expirada', color: 'text-red-600 bg-red-50 border-red-100' },
    unpaid: { label: 'Não Paga', color: 'text-red-600 bg-red-50 border-red-100' },
  };

  const status = statusMap[user.subscriptionStatus || 'active'] || { label: 'Ativa', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CreditCard size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Assinatura</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Info size={14} />
            Plano Atual
          </div>
          <p className="text-lg font-bold text-slate-900">Concurseiro Pro Mensal</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Calendar size={14} />
            Acesso até
          </div>
          <p className="text-lg font-bold text-slate-900">
            {formatDate(user.subscriptionCurrentPeriodEnd)}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <CreditCard size={14} />
            Próxima Cobrança
          </div>
          <p className="text-lg font-bold text-slate-900">
            {user.subscriptionCancelAtPeriodEnd ? (
              <span className="text-slate-400 font-medium">Nenhuma</span>
            ) : (
              formatDate(user.subscriptionNextBillingDate || user.subscriptionCurrentPeriodEnd)
            )}
          </p>
          {user.subscriptionCancelAtPeriodEnd && (
            <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Info size={12} />
              Assinatura cancelada.
            </p>
          )}
        </div>
      </div>

      {user.subscriptionCancelAtPeriodEnd && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-amber-600 mt-0.5" size={18} />
          <p className="text-sm text-amber-800">
            Sua assinatura foi cancelada, mas você continuará com acesso <strong>Pro</strong> até o dia <strong>{formatDate(user.subscriptionCurrentPeriodEnd)}</strong>. Após essa data, sua conta voltará para o plano gratuito.
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 max-w-xs">
          Gerencie suas formas de pagamento, faturas e cancelamento no portal seguro do Stripe.
        </p>
        <button 
          onClick={handleManageSubscription}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Settings size={18} />
          )}
          Gerenciar Assinatura
        </button>
      </div>
    </motion.div>
  );
};
