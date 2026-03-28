import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 flex flex-col items-center text-center space-y-6"
    >
      <div className="p-4 bg-gray-50 rounded-2xl">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && actionLink && (
        <Link 
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}
