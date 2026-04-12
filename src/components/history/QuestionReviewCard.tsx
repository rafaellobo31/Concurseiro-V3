import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, BookOpen, MessageSquare, Info, Landmark, Calendar, Tag, Lock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { QuestionReviewData } from '../../services/examReviewService';
import { usePlan } from '../../hooks/usePlan';

interface QuestionReviewCardProps {
  question: QuestionReviewData;
  index: number;
}

export const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({ question, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isFree, loading } = usePlan();

  return (
    <div className={cn(
      "bg-white rounded-3xl border transition-all duration-300 overflow-hidden",
      question.isCorrect 
        ? "border-emerald-100 shadow-sm hover:shadow-md" 
        : "border-rose-100 shadow-sm hover:shadow-md"
    )}>
      {/* Header / Summary View */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 flex items-start gap-5 hover:bg-slate-50/50 transition-colors"
      >
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
          question.isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
        )}>
          {question.isCorrect ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Questão {index + 1}</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {question.assunto}
              </span>
              {question.banca && (
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-amber-100 flex items-center gap-1.5">
                  <Landmark className="w-3 h-3" />
                  {question.banca}
                </span>
              )}
            </div>
          </div>
          <p className="text-slate-900 font-bold text-lg line-clamp-2 leading-snug">
            {question.enunciado}
          </p>
        </div>

        <div className="flex-shrink-0 self-center p-2 rounded-full hover:bg-slate-100 transition-colors">
          {isExpanded ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-t border-slate-100"
          >
            <div className="p-8 space-y-10 bg-slate-50/30">
              {/* Full Question Text */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Enunciado Completo</span>
                </div>
                <p className="text-slate-800 text-xl leading-relaxed font-medium">{question.enunciado}</p>
              </div>

              {/* Alternatives Section */}
              {question.alternativas && Array.isArray(question.alternativas) && question.alternativas.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Análise das Alternativas</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {question.alternativas.map((alt: any) => {
                      const isUserChoice = question.userAnswer === alt.letra;
                      const isCorrectChoice = question.correta === alt.letra;
                      
                      return (
                        <div 
                          key={alt.letra}
                          className={cn(
                            "p-5 rounded-2xl border-2 text-base flex gap-5 transition-all",
                            isCorrectChoice 
                              ? "bg-emerald-50 border-emerald-500/30 text-emerald-900 shadow-sm" 
                              : isUserChoice 
                                ? "bg-rose-50 border-rose-500/30 text-rose-900 shadow-sm" 
                                : "bg-white border-slate-100 text-slate-600"
                          )}
                        >
                          <span className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg shadow-sm",
                            isCorrectChoice ? "bg-emerald-500 text-white" :
                            isUserChoice ? "bg-rose-500 text-white" :
                            "bg-slate-100 text-slate-400"
                          )}>
                            {alt.letra}
                          </span>
                          <span className="flex-1 font-medium pt-1.5 leading-relaxed text-lg">{alt.texto}</span>
                          
                          <div className="flex flex-col items-end gap-2 self-start pt-2">
                            {isCorrectChoice && (
                              <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest bg-emerald-100/50 px-2 py-1 rounded-lg">
                                Gabarito
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                            {isUserChoice && (
                              <div className={cn(
                                "flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg",
                                isCorrectChoice ? "text-emerald-600 bg-emerald-100/50" : "text-rose-600 bg-rose-100/50"
                              )}>
                                Sua Escolha
                                {isCorrectChoice ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Review Point - Pedagógico */}
              {question.ponto_revisao && (
                <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-100 relative overflow-hidden shadow-sm">
                  <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Ponto de Revisão Estratégica</span>
                      <p className="text-amber-900 text-xl font-bold leading-relaxed italic">
                        "{question.ponto_revisao}"
                      </p>
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl" />
                </div>
              )}

              {/* Explanation Section */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-widest">Explicação Pedagógica</h4>
                </div>
                <div className="h-px bg-slate-100 w-full" />
                
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Verificando acesso...</p>
                  </div>
                ) : isFree ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-sm">
                      <Lock size={32} />
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-xl font-bold text-slate-900">Conteúdo Exclusivo Pro</h5>
                      <p className="text-slate-500 max-w-sm mx-auto text-lg">
                        Explicação pedagógica completa disponível no plano Pro.
                      </p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Ver Planos
                    </Link>
                  </div>
                ) : (
                  <p className="text-slate-600 text-lg leading-loose whitespace-pre-wrap font-medium">
                    {question.explicacao}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
