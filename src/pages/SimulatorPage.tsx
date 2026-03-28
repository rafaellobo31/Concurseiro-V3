import { useState, useEffect } from 'react';
import { SimulatorInput, SimulatorOutput } from '../types/simulator';
import { SimulatorForm } from '../components/simulator/SimulatorForm';
import { SimulatorView } from '../components/simulator/SimulatorView';
import { SimulatorResult } from '../components/simulator/SimulatorResult';
import { generateSimulator } from '../services/simulatorService';
import { historyService } from '../services/historyService';
import { LoadingState } from '../components/ui/LoadingState';
import { Sparkles, BrainCircuit, Loader2, Target, BookOpen, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_MESSAGES = [
  "Consultando banco de questões...",
  "Adaptando enunciados ao perfil da banca...",
  "Elaborando alternativas plausíveis...",
  "Construindo explicações didáticas...",
  "Ajustando nível de dificuldade...",
  "Finalizando seu simulado personalizado..."
];

export default function SimulatorPage() {
  const [view, setView] = useState<'form' | 'loading' | 'taking' | 'result' | 'saving'>('form');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [simulator, setSimulator] = useState<SimulatorOutput | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === 'loading' || view === 'saving') {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [view]);

  const handleGenerateSimulator = async (input: SimulatorInput) => {
    setView('loading');
    
    try {
      const newSimulator = await generateSimulator(input);
      setSimulator(newSimulator);
      setView('taking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao gerar simulado:', error);
      setView('form');
    }
  };

  const handleFinishSimulator = async (answers: Record<number, any>) => {
    setView('saving');
    setUserAnswers(answers);
    
    try {
      if (simulator) {
        let correct = 0;
        simulator.questoes.forEach(q => {
          const answer = answers[q.id];
          if (q.tipo === 'multipla_escolha') {
            if (answer === q.correta) correct++;
          } else {
            const afAnswers = (answer || {}) as Record<number, boolean>;
            const allCorrect = q.afirmativas?.every(af => afAnswers[af.id] === af.correta);
            if (allCorrect) correct++;
          }
        });

        const total = simulator.questoes.length;
        const percent = Math.round((correct / total) * 100);

        await historyService.saveHistoryItem({
          mode: simulator.modo === 'concurso' ? 'por_concurso' : 'por_materia',
          tipoQuestao: simulator.tipoQuestao,
          origemQuestoes: simulator.questoes.some(q => q.sourceMode === 'previous_exam_based') ? 'provas_anteriores' : 'ia_generativa',
          concurso: simulator.concurso,
          materia: simulator.materia,
          area: simulator.cargo,
          banca: simulator.banca,
          quantidadeQuestoes: total,
          acertos: correct,
          erros: total - correct,
          percentual: percent,
          nivelDesempenho: percent >= 80 ? 'Forte' : percent >= 60 ? 'Bom' : percent >= 40 ? 'Atenção' : 'Crítico',
          mensagemResumo: `Simulado finalizado com ${percent}% de aproveitamento.`,
          assuntosParaRevisao: Array.from(new Set(simulator.questoes.filter(q => {
            const answer = answers[q.id];
            if (q.tipo === 'multipla_escolha') return answer !== q.correta;
            const afAnswers = (answer || {}) as Record<number, boolean>;
            return !q.afirmativas?.every(af => afAnswers[af.id] === af.correta);
          }).map(q => q.assunto)))
        });
      }
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao salvar simulado:', error);
      setView('result'); // Still show result even if save fails for UX
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setView('taking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        {view === 'form' && (
          <div className="mb-12 text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100"
            >
              <Target className="w-4 h-4" />
              Treino de Alta Performance
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Simulados Gerados por <span className="text-indigo-600">IA</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Treine com questões inéditas e explicações detalhadas. Personalize sua banca, matéria e nível de dificuldade.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {(view === 'loading' || view === 'saving') ? (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <LoadingState 
                message={view === 'loading' ? LOADING_MESSAGES[loadingMessageIndex] : "Finalizando simulado e salvando seu progresso..."} 
              />
            </motion.div>
          ) : view === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SimulatorForm onSubmit={handleGenerateSimulator} loading={false} />
              
              {/* Features */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Questões Inéditas</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Nossa IA cria questões novas baseadas nos padrões das bancas, evitando que você decore questões antigas.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Explicações Didáticas</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Cada resposta vem acompanhada de uma explicação completa que ensina o fundamento jurídico ou lógico.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Foco na Banca</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    O estilo de cobrança (literalidade, casos práticos ou jurisprudência) se adapta à banca escolhida.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : view === 'taking' && simulator ? (
            <motion.div
              key="taking"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SimulatorView 
                simulator={simulator} 
                onFinish={handleFinishSimulator}
                onCancel={() => setView('form')}
              />
            </motion.div>
          ) : view === 'result' && simulator ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SimulatorResult 
                simulator={simulator} 
                answers={userAnswers}
                onRetry={handleRetry}
                onHome={() => setView('form')}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
