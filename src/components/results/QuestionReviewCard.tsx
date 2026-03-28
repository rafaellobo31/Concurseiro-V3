import React, { useState } from 'react';
import { QuestionCorrectionResult } from '../../types/correction';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, BookOpen, MessageSquare, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';

interface QuestionReviewCardProps {
  result: QuestionCorrectionResult;
  index: number;
}

export const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({ result, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all overflow-hidden",
      result.isCorrect ? "border-emerald-100" : "border-red-100"
    )}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors"
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          result.isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
        )}>
          {result.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Questão {index + 1}</span>
            {result.sourceMode === 'previous_exam_based' ? (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                {result.banca || 'Banca'} {result.concursoReferencia ? `• ${result.concursoReferencia}` : ''} {result.ano ? `• ${result.ano}` : ''}
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-100 flex items-center gap-1">
                <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                IA {result.banca ? `• Estilo ${result.banca}` : ''}
              </span>
            )}
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider">
              {result.assunto}
            </span>
          </div>
          <p className="text-gray-900 font-bold line-clamp-2 leading-relaxed">
            {result.enunciado}
          </p>
        </div>

        <div className="flex-shrink-0 self-center">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-50"
          >
            <div className="p-6 space-y-6 bg-gray-50/50">
              {/* Question Text Full */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Enunciado Completo</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{result.enunciado}</p>
              </div>

              {/* Alternatives */}
              {result.alternativas && result.alternativas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Alternativas</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {result.alternativas.map((alt) => {
                      const isUserChoice = result.userAnswer === alt.letra;
                      const isCorrectChoice = result.correctAnswer === alt.letra;
                      
                      return (
                        <div 
                          key={alt.letra}
                          className={cn(
                            "p-3 rounded-xl border text-sm flex gap-3 transition-colors",
                            isCorrectChoice ? "bg-emerald-50 border-emerald-200 text-emerald-900" : 
                            isUserChoice ? "bg-red-50 border-red-200 text-red-900" :
                            "bg-white border-gray-100 text-gray-700"
                          )}
                        >
                          <span className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs",
                            isCorrectChoice ? "bg-emerald-500 text-white" :
                            isUserChoice ? "bg-red-500 text-white" :
                            "bg-gray-100 text-gray-500"
                          )}>
                            {alt.letra}
                          </span>
                          <span className="flex-1">{alt.texto}</span>
                          {isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-emerald-500 self-center" />}
                          {isUserChoice && !isCorrectChoice && <XCircle className="w-4 h-4 text-red-500 self-center" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn(
                  "p-4 rounded-xl border",
                  result.isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                )}>
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-60">Sua Resposta</span>
                  <p className={cn("font-bold", result.isCorrect ? "text-emerald-700" : "text-red-700")}>
                    {result.userAnswer}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50">
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-60 text-emerald-600">Gabarito</span>
                  <p className="font-bold text-emerald-700">
                    {result.correctAnswer}
                  </p>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Feedback do Mentor IA</span>
                </div>
                <p className="text-indigo-900 text-sm font-medium leading-relaxed italic">
                  "{result.feedback}"
                </p>
              </div>

              {/* Explanation */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Explicação Detalhada</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
