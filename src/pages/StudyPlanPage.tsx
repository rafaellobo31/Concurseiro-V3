import { useState, useEffect } from 'react';
import { StudyPlanInput, StudyPlanOutput } from '../types/studyPlan';
import { StudyPlanForm } from '../components/studyPlan/StudyPlanForm';
import { StudyPlanResult } from '../components/studyPlan/StudyPlanResult';
import { generateStudyPlan } from '../services/studyPlanService';
import { dashboardAnalyticsService } from '../services/dashboardAnalyticsService';
import { Sparkles, Layout, ShieldCheck, GraduationCap, BrainCircuit, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_MESSAGES = [
  "Analisando seu desempenho real...",
  "Mapeando suas matérias críticas...",
  "Calculando a distribuição estratégica...",
  "Definindo ciclos de revisão personalizada...",
  "Otimizando seu tempo disponível...",
  "Finalizando seu plano de alta performance..."
];

export default function StudyPlanPage() {
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [plan, setPlan] = useState<StudyPlanOutput | null>(null);
  const [userInput, setUserInput] = useState<StudyPlanInput | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGeneratePlan = async (input: StudyPlanInput) => {
    setLoading(true);
    
    try {
      // Buscar dados reais de desempenho
      const analytics = await dashboardAnalyticsService.getDashboardAnalytics();
      
      const inputWithPerformance: StudyPlanInput = {
        ...input,
        performanceData: analytics ? {
          mediaGeral: analytics.visaoGeral.mediaGeral,
          desempenhoPorMateria: analytics.desempenhoPorMateria,
          assuntosCriticos: analytics.assuntosCriticos
        } : undefined
      };

      setUserInput(inputWithPerformance);
      setRetryMessage(null);
      const newPlan = await generateStudyPlan(inputWithPerformance, (attempt) => {
        setRetryMessage(`A IA está com alta demanda. Tentativa ${attempt} de 2...`);
      });
      setPlan(newPlan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        {!plan && !loading && (
          <div className="mb-12 text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100"
            >
              <Sparkles className="w-4 h-4" />
              Consultoria Estratégica
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Seu Plano de Estudos <span className="text-indigo-600">Profissional</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Responda algumas perguntas e receba um cronograma completo, táticas de banca e orientações de performance para sua aprovação.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-white p-8 rounded-full shadow-xl border border-indigo-50">
                  <BrainCircuit className="w-16 h-16 text-indigo-600 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Gerando sua Estratégia</h2>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-indigo-600 font-medium"
                  >
                    {retryMessage || LOADING_MESSAGES[loadingMessageIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              
              {retryMessage && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-sm font-bold animate-pulse">
                  <BrainCircuit className="w-4 h-4" />
                  IA sobrecarregada, tentando novamente...
                </div>
              )}
              
              <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "linear" }}
                />
              </div>
            </motion.div>
          ) : !plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StudyPlanForm onSubmit={handleGeneratePlan} loading={loading} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <StudyPlanResult plan={plan} input={userInput!} onBack={() => setPlan(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section (only visible when no plan and not loading) */}
        {!plan && !loading && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Layout className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Grade Inteligente</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Distribuição automática de matérias baseada no seu tempo disponível e peso do edital.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Táticas de Banca</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Análise do perfil da organizadora e recomendações de como abordar cada tipo de questão.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Ciclos de Revisão</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Metodologia científica de revisão para garantir que o conhecimento permaneça na memória de longo prazo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
