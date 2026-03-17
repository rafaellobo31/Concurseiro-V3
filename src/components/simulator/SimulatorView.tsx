import { useState } from 'react';
import { SimulatorOutput, Question } from '../../types/simulator';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Send, AlertCircle } from 'lucide-react';

interface SimulatorViewProps {
  simulator: SimulatorOutput;
  onFinish: (answers: Record<number, any>) => void;
  onCancel: () => void;
}

export function SimulatorView({ simulator, onFinish, onCancel }: SimulatorViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const currentQuestion = simulator.questoes[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === simulator.questoes.length - 1;
  const progress = ((currentQuestionIndex + 1) / simulator.questoes.length) * 100;

  const handleSelectAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < simulator.questoes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfirmFinish(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isAnswered = (questionId: number) => answers[questionId] !== undefined;
  const allAnswered = simulator.questoes.every(q => isAnswered(q.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header & Progress */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{simulator.tituloSimulado}</h2>
            <p className="text-sm text-gray-500">Questão {currentQuestionIndex + 1} de {simulator.questoes.length}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            Encerrar Simulado
          </button>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8"
        >
          <div className="space-y-4">
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
            <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
              {currentQuestion.enunciado}
            </h3>
          </div>

          {/* Alternatives */}
          <div className="space-y-3">
            {currentQuestion.tipo === 'multipla_escolha' ? (
              currentQuestion.alternativas?.map((alt) => (
                <button
                  key={alt.letra}
                  onClick={() => handleSelectAnswer(currentQuestion.id, alt.letra)}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
                    answers[currentQuestion.id] === alt.letra
                      ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                      : 'bg-white border-gray-100 hover:border-indigo-100 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                    answers[currentQuestion.id] === alt.letra
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-gray-200 text-gray-400'
                  }`}>
                    <span className="text-xs font-bold">{alt.letra}</span>
                  </div>
                  <span className={`text-sm leading-relaxed ${
                    answers[currentQuestion.id] === alt.letra ? 'text-indigo-900 font-medium' : 'text-gray-600'
                  }`}>
                    {alt.texto}
                  </span>
                </button>
              ))
            ) : (
              <div className="space-y-6">
                {currentQuestion.afirmativas?.map((af) => (
                  <div key={af.id} className="space-y-3 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-700 font-medium">{af.texto}</p>
                    <div className="flex gap-4">
                      {[
                        { val: true, label: 'Verdadeiro' },
                        { val: false, label: 'Falso' }
                      ].map((opt) => {
                        const currentAnswers = (answers[currentQuestion.id] || {}) as Record<number, boolean>;
                        const isSelected = currentAnswers[af.id] === opt.val;
                        
                        return (
                          <button
                            key={opt.label}
                            onClick={() => {
                              const newAfAnswers = { ...currentAnswers, [af.id]: opt.val };
                              handleSelectAnswer(currentQuestion.id, newAfAnswers);
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                              isSelected
                                ? opt.val 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100'
                                  : 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-100'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 text-gray-500 font-bold hover:text-indigo-600 disabled:opacity-0 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Anterior
        </button>

        <div className="flex items-center gap-4">
          {!allAnswered && !isLastQuestion && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Questões pendentes
            </span>
          )}
          
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
              isLastQuestion
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isLastQuestion ? (
              <>
                Finalizar Simulado
                <Send className="w-5 h-5" />
              </>
            ) : (
              <>
                Próxima Questão
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirm Finish Modal */}
      <AnimatePresence>
        {showConfirmFinish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Finalizar Simulado?</h3>
                <p className="text-gray-500">
                  {allAnswered 
                    ? "Você respondeu todas as questões. Deseja ver seu desempenho agora?"
                    : "Algumas questões ainda não foram respondidas. Deseja finalizar assim mesmo?"}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => onFinish(answers)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Sim, finalizar e ver resultado
                </button>
                <button
                  onClick={() => setShowConfirmFinish(false)}
                  className="w-full bg-white text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Voltar para as questões
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
