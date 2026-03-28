import { CheckCircle2, AlertCircle, Info, XCircle, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FeedbackType = 'success' | 'error' | 'info' | 'warning';

interface FeedbackMessageProps {
  type: FeedbackType;
  title: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const FEEDBACK_CONFIG: Record<FeedbackType, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100'
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100'
  },
  info: {
    icon: Info,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100'
  }
};

export function FeedbackMessage({ type, title, message, onClose, className = "" }: FeedbackMessageProps) {
  const config = FEEDBACK_CONFIG[type];
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-5 rounded-2xl border ${config.border} ${config.bg} flex items-start gap-4 relative ${className}`}
    >
      <div className={`p-2 rounded-xl ${config.bg} border ${config.border}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      
      <div className="flex-1 space-y-1 pr-8">
        <h4 className={`font-bold text-sm ${config.color}`}>{title}</h4>
        <p className="text-sm text-gray-600 font-medium leading-relaxed">{message}</p>
      </div>

      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}
