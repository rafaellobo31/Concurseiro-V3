import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Flag, Send, AlertCircle, BrainCircuit, Loader2, CheckCircle2 } from 'lucide-react';
import { examService } from '../services/examService';
import { correctionService } from '../services/correctionService';
import { historyService } from '../services/historyService';
import { useAuth } from '../hooks/useAuth';
import { Exam, Question } from '../types';
import { ExamOutput, ExamQuestion } from '../types/exam';
import { CorrectionInput, UserAnswer } from '../types/correction';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

const LOADING_MESSAGES = [
  "Consultando banco de questões...",
  "Adaptando enunciados ao perfil da banca...",
  "Elaborando alternativas plausíveis...",
  "Construindo explicações didáticas...",
  "Ajustando nível de dificuldade...",
  "Finalizando seu simulado personalizado..."
];

export default function ExamSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [rawExam, setRawExam] = useState<ExamOutput | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generating) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [generating]);

  useEffect(() => {
    async function loadExam() {
      if (!id) return;

      if (id.startsWith('new-')) {
        const input = location.state?.input;
        if (!input) {
          navigate('/simulados');
          return;
        }

        setGenerating(true);
        try {
          const output = await examService.generateExam(input);
          setRawExam(output);
          const mappedExam = mapOutputToExam(output);
          setExam(mappedExam);
          setTimeLeft(output.questoes.length * 180); // 3 minutes per question
        } catch (error) {
          console.error('Erro ao gerar simulado:', error);
          navigate('/simulados');
        } finally {
          setGenerating(false);
          setLoading(false);
        }
      } else {
        const data = await examService.getExamById(id);
        setExam(data);
        setLoading(false);
      }
    }
    loadExam();
  }, [id, location.state]);

  const mapOutputToExam = (output: ExamOutput): Exam => {
    return {
      id: `gen-${Math.random().toString(36).substr(2, 9)}`,
      title: output.tituloSimulado,
      description: output.descricao,
      createdAt: new Date().toISOString(),
      questions: output.questoes.map(q => ({
        id: q.id.toString(),
        text: q.enunciado,
        subject: q.assunto,
        explanation: q.explicacao,
        alternatives: q.tipo === 'multipla_escolha' 
          ? (q.alternativas || []).map(alt => ({
              id: alt.letra,
              text: alt.texto,
              isCorrect: alt.letra === q.correta
            }))
          : (q.afirmativas || []).map(af => ({
              id: af.id.toString(),
              text: af.texto,
              isCorrect: af.correta
            }))
      }))
    };
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionId: number, alternativeId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: alternativeId }));
  };

  const handleTFAnswer = (questionId: number, statementId: number, value: boolean) => {
    const currentTFAnswers = answers[questionId] || {};
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...currentTFAnswers, [statementId]: value }
    }));
  };

  const handleSubmit = async () => {
    if (!exam || !rawExam) return;
    
    setCorrecting(true);
    
    try {
      // Prepara as respostas para o formato de correção
      const userAnswers: UserAnswer[] = rawExam.questoes.map(q => {
        const answer = answers[q.id];
        if (q.tipo === 'multipla_escolha') {
          return {
            questionId: q.id,
            selectedOption: answer as string
          };
        } else {
          // verdadeiro_falso
          const statementsAnswers = answer || {};
          return {
            questionId: q.id,
            statements: q.afirmativas?.map(af => ({
              id: af.id,
              answer: statementsAnswers[af.id] ?? false // Assume falso se não respondido
            })) || []
          };
        }
      });

      const timeSpent = 1800 - timeLeft;

      // Chama o serviço de correção
      const correction = await correctionService.correctExam({
        exam: rawExam,
        answers: userAnswers,
        timeSpent
      });

      // Salva o resultado básico (compatibilidade com o dashboard atual)
      await examService.saveResult({
        examId: exam.id,
        userId: user?.id || 'anonymous',
        score: correction.summary.score,
        totalQuestions: correction.summary.totalQuestions,
        correctAnswers: correction.summary.correctAnswers,
        timeSpent: correction.summary.timeSpent,
      });

      // Salva no Histórico Detalhado
      await historyService.saveHistoryItem({
        mode: rawExam.modo === 'concurso' ? 'por_concurso' : 'por_materia',
        tipoQuestao: rawExam.tipoQuestao,
        origemQuestoes: rawExam.questoes.some(q => q.sourceMode === 'previous_exam_based') ? 'provas_anteriores' : 'ia_generativa',
        concurso: rawExam.concurso,
        materia: rawExam.materia,
        area: rawExam.cargo,
        banca: rawExam.banca,
        quantidadeQuestoes: correction.summary.totalQuestions,
        acertos: correction.summary.correctAnswers,
        erros: correction.summary.totalQuestions - correction.summary.correctAnswers,
        percentual: correction.summary.score,
        nivelDesempenho: correction.summary.performanceLevel,
        assuntosParaRevisao: correction.analysis.weaknesses,
        mensagemResumo: correction.analysis.recommendations.join(' ')
      });

      // Navega para a página de resultados com o objeto completo de correção
      navigate('/results', { state: { correction } });
    } catch (error) {
      console.error("Erro ao corrigir simulado:", error);
      // Fallback simples em caso de erro crítico
      navigate('/results', { state: { score: 0, correctCount: 0, total: exam.questions.length } });
    } finally {
      setCorrecting(false);
    }
  };

  if (generating) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-8">
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
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Construindo seu Simulado</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-indigo-600 font-medium"
          >
            {LOADING_MESSAGES[loadingMessageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 15, ease: "linear" }}
        />
      </div>
    </div>
  );

  if (correcting) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="relative bg-white p-8 rounded-full shadow-xl border border-emerald-50">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Corrigindo seu Simulado</h2>
        <p className="text-gray-500 font-medium animate-pulse">
          O Mentor IA está analisando suas respostas e preparando seu plano de ação...
        </p>
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!exam || !rawExam) return <div className="text-center py-20">Simulado não encontrado.</div>;

  const currentQuestion = rawExam.questoes[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / rawExam.questoes.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">{rawExam.tituloSimulado}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-indigo-600 font-mono font-bold">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={handleSubmit}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              Finalizar
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Question Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                Questão {currentQuestionIndex + 1} de {rawExam.questoes.length}
              </span>
              <button className="flex items-center gap-1 text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors">
                <Flag className="w-4 h-4" />
                Reportar erro
              </button>
            </div>

            {/* Question Text */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {currentQuestion.sourceMode === 'previous_exam_based' ? (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100 flex items-center gap-1.5">
                    {currentQuestion.banca || 'Banca'} {currentQuestion.concursoReferencia ? `• ${currentQuestion.concursoReferencia}` : ''} {currentQuestion.ano ? `• ${currentQuestion.ano}` : ''}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    Questão criada por IA {currentQuestion.banca ? `• Estilo ${currentQuestion.banca}` : ''}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                  {currentQuestion.assunto}
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                  Peso {currentQuestion.peso}
                </span>
              </div>
              <p className="text-xl text-gray-800 leading-relaxed font-bold">
                {currentQuestion.enunciado}
              </p>
            </div>

            {/* Alternatives / Statements */}
            <div className="space-y-4">
              {currentQuestion.tipo === 'multipla_escolha' ? (
                <div className="space-y-3">
                  {currentQuestion.alternativas?.map((alt, i) => {
                    const isSelected = answers[currentQuestion.id] === alt.letra;
                    return (
                      <button
                        key={alt.letra}
                        onClick={() => handleSelectAnswer(currentQuestion.id, alt.letra)}
                        className={cn(
                          "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 group",
                          isSelected 
                            ? "border-indigo-600 bg-indigo-50" 
                            : "border-gray-100 bg-white hover:border-indigo-200 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors",
                          isSelected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                        )}>
                          {alt.letra}
                        </div>
                        <span className={cn(
                          "text-gray-700 leading-relaxed",
                          isSelected ? "font-bold text-indigo-900" : "font-medium"
                        )}>
                          {alt.texto}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  {currentQuestion.afirmativas?.map((af) => {
                    const currentVal = answers[currentQuestion.id]?.[af.id];
                    return (
                      <div key={af.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <p className="text-gray-700 font-medium leading-relaxed">{af.texto}</p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleTFAnswer(currentQuestion.id, af.id, true)}
                            className={cn(
                              "flex-1 py-3 rounded-xl font-bold transition-all border-2",
                              currentVal === true
                                ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                : "bg-white border-gray-100 text-gray-500 hover:border-emerald-200"
                            )}
                          >
                            Verdadeiro
                          </button>
                          <button
                            onClick={() => handleTFAnswer(currentQuestion.id, af.id, false)}
                            className={cn(
                              "flex-1 py-3 rounded-xl font-bold transition-all border-2",
                              currentVal === false
                                ? "bg-red-50 border-red-500 text-red-700"
                                : "bg-white border-gray-100 text-gray-500 hover:border-red-200"
                            )}
                          >
                            Falso
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {currentQuestionIndex === rawExam.questoes.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Finalizar Simulado
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-100 text-gray-900 font-bold hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all"
            >
              Próxima
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Submit Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40">
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          Finalizar Simulado
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
