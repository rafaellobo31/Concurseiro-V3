import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Carregando...", className = "" }: LoadingStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center py-12 space-y-4 ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-20 animate-pulse" />
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin relative" />
      </div>
      <p className="text-gray-500 font-medium animate-pulse">{message}</p>
    </motion.div>
  );
}
