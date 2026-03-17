import { BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function HistoryEmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-12 text-center space-y-6"
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-50" />
        <div className="relative bg-white p-6 rounded-full shadow-sm border border-gray-50">
          <BookOpen className="w-12 h-12 text-indigo-600" />
        </div>
        <div className="absolute -top-2 -right-2 bg-amber-100 p-2 rounded-full border-2 border-white">
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>
      </div>

      <div className="max-w-sm mx-auto space-y-2">
        <h3 className="text-xl font-black text-gray-900">Seu histórico está vazio</h3>
        <p className="text-gray-500 font-medium">
          Você ainda não realizou nenhum simulado. Comece agora para acompanhar sua evolução e receber dicas personalizadas do Mentor IA.
        </p>
      </div>

      <Link
        to="/simulados"
        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
      >
        Gerar Meu Primeiro Simulado
      </Link>
    </motion.div>
  );
}
