import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, BookOpen, Sparkles, Info, FileText } from 'lucide-react';
import { ConcursoSimuladoForm } from '../components/simulados/ConcursoSimuladoForm';
import { MateriaSimuladoForm } from '../components/simulados/MateriaSimuladoForm';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

type TabType = 'concurso' | 'materia' | 'edital';

export default function SimuladosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('concurso');
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Gerador de Simulados
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Escolha como deseja treinar hoje. Você pode focar em um concurso específico ou dominar uma matéria de cada vez.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 max-w-lg">
        <button
          onClick={() => setActiveTab('concurso')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'concurso'
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Landmark className="w-4 h-4" />
          Por Concurso
        </button>
        <button
          onClick={() => setActiveTab('materia')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'materia'
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Por Matéria
        </button>
        <button
          onClick={() => setActiveTab('edital')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'edital'
              ? "bg-white text-amber-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <FileText className="w-4 h-4" />
          Por Edital
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'concurso' ? (
              <motion.div
                key="concurso"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Simulado por Concurso</h2>
                  <p className="text-sm text-gray-500">
                    Gere questões baseadas no perfil de cobrança de editais específicos.
                  </p>
                </div>
                <ConcursoSimuladoForm />
              </motion.div>
            ) : activeTab === 'materia' ? (
              <motion.div
                key="materia"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Simulado por Matéria</h2>
                  <p className="text-sm text-gray-500">
                    Foque em tópicos específicos para fortalecer seus pontos fracos.
                  </p>
                </div>
                <MateriaSimuladoForm />
              </motion.div>
            ) : (
              <motion.div
                key="edital"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto">
                  <FileText className="text-amber-600 w-10 h-10" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Análise Inteligente de Edital</h2>
                  <p className="text-gray-500">
                    Envie o PDF do seu edital e nossa IA criará um simulado 100% personalizado com base no conteúdo programático.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/edital-simulado')}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Começar Análise de Edital
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center gap-3">
          <Info className="w-5 h-5 text-gray-400" />
          <p className="text-xs text-gray-500">
            Nossa IA seleciona as melhores questões do banco de dados para garantir um treino realista e eficiente.
          </p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <Landmark className="text-blue-600 w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Foco no Edital</h3>
          <p className="text-sm text-gray-500">Simulados por concurso seguem a distribuição de matérias comum para o cargo escolhido.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="text-emerald-600 w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Estudo Dirigido</h3>
          <p className="text-sm text-gray-500">Ideal para quando você terminou de estudar um tópico e quer validar o conhecimento.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="text-amber-600 w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">IA Potencializada</h3>
          <p className="text-sm text-gray-500">Questões comentadas e análise de desempenho para cada simulado gerado.</p>
        </div>
      </div>
    </div>
  );
}
