import { User as UserIcon, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { motion } from 'motion/react';

interface ProfileHeaderCardProps {
  user: User;
}

export const ProfileHeaderCard = ({ user }: ProfileHeaderCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
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
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />
      <div className="px-8 pb-8 -mt-12 relative">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
            <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={48} />
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{user.name || 'Usuário'}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail size={16} className="text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-slate-400" />
                Membro desde {formatDate(user.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-indigo-500" />
                Status: <span className="text-slate-900 font-medium">Ativo</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
