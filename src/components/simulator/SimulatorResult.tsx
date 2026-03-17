import { SimulatorOutput, Question } from '../../types/simulator';
import { motion } from 'motion/react';
import { Trophy, Target, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, RotateCcw, Home } from 'lucide-react';
import { useState } from 'react';

interface SimulatorResultProps {
  simulator: SimulatorOutput;
  answers: Record<number, any>;
  onRetry: () => void;
  onHome: () => void;
}

export function SimulatorResult({ simulator, answers, onRetry, onHome }: SimulatorResultProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const calculateScore = () => {
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
    return {
      correct,
      total: simulator.questoes.length,
      percent: Math.round((correct / simulator.questoes.length) * 100)
    };
  };

  const score = calculateScore();

  const isCorrect = (q: Question) => {
    const answer = answers[q.id];
    if (q.tipo === 'multipla_escolha') {
      return answer === q.correta;
    } else {
      const afAnswers = (answer || {}) as Record<number, boolean>;
      return q.afirmativas?.every(af => afAnswers[af.id] === af.correta);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className="bg-indigo-600 p-10 text-center text-white space-y-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold">Resultado do Simulado</h2>
            <p className="text-indigo-100 font-medium">{simulator.tituloSimulado}</p>
          </div>
          <div className="flex justify-center gap-12 pt-4">
            <div className="text-center">
              <p className="text-4xl font-black">{score.percent}%</p>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Aproveitamento</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-4xl font-black">{score.correct}/{score.total}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Acertos</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold hover:bg-indigo-100 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Tentar Novamente
          </button>
          <button
            onClick={onHome}
            className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </button>
        </div>
      </motion.div>

      {/* Questions Review */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Target className="w-6 h-6 text-indigo-600" />
          Revisão de Questões
        </h3>

        {simulator.questoes.map((q, idx) => {
          const correct = isCorrect(q);
          const isExpanded = expandedQuestion === q.id;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                correct ? 'border-emerald-100' : 'border-red-100'
              }`}
            >
              <button
                onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                className="w-full p-6 flex items-start justify-between text-left"
              >
                <div className="flex gap-4">
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    correct ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Questão {idx + 1}</p>
                    <p className="text-gray-900 font-medium line-clamp-2">{q.enunciado}</p>
                  </div>
                </div>
                <div className="ml-4 mt-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-8 space-y-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="h-px bg-gray-100" />
                  
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{q.enunciado}</p>
                    
                    {/* Alternatives Review */}
                    <div className="space-y-2">
                      {q.tipo === 'multipla_escolha' ? (
                        q.alternativas?.map(alt => {
                          const isUserAnswer = answers[q.id] === alt.letra;
                          const isCorrectAlt = alt.letra === q.correta;
                          
                          return (
                            <div
                              key={alt.letra}
                              className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
                                isCorrectAlt 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                  : isUserAnswer 
                                    ? 'bg-red-50 border-red-200 text-red-900'
                                    : 'bg-gray-50 border-gray-100 text-gray-600'
                              }`}
                            >
                              <span className="font-bold">{alt.letra})</span>
                              <span>{alt.texto}</span>
                              {isCorrectAlt && <CheckCircle2 className="w-4 h-4 ml-auto flex-shrink-0" />}
                              {isUserAnswer && !isCorrectAlt && <XCircle className="w-4 h-4 ml-auto flex-shrink-0" />}
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-4">
                          {q.afirmativas?.map(af => {
                            const userVal = (answers[q.id] || {})[af.id];
                            const correctAf = userVal === af.correta;
                            
                            return (
                              <div key={af.id} className="p-4 rounded-xl border bg-gray-50 border-gray-100 space-y-2">
                                <p className="text-sm text-gray-700">{af.texto}</p>
                                <div className="flex gap-2">
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    af.correta ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    Gabarito: {af.correta ? 'Verdadeiro' : 'Falso'}
                                  </span>
                                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    correctAf ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    Sua Resposta: {userVal === undefined ? 'Não respondida' : userVal ? 'Verdadeiro' : 'Falso'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-indigo-50 p-6 rounded-2xl space-y-2">
                    <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Explicação do Especialista
                    </h4>
                    <p className="text-sm text-indigo-800 leading-relaxed">
                      {q.explicacao}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
