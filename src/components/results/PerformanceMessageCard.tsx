import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PerformanceMessageCardProps {
  score: number;
  level: string;
}

export function PerformanceMessageCard({ score, level }: PerformanceMessageCardProps) {
  const getMessage = () => {
    if (score >= 90) {
      return {
        title: "Desempenho de Elite!",
        description: "Você está em um nível altíssimo de preparação. Seu domínio sobre os temas abordados é evidente. Continue mantendo o ritmo e foque em detalhes pontuais para garantir a vaga.",
        icon: <Sparkles className="w-8 h-8 text-amber-500" />,
        color: "border-amber-200 bg-amber-50/50 text-amber-900"
      };
    }
    if (score >= 75) {
      return {
        title: "Excelente Evolução!",
        description: "Seu desempenho está acima da média. Você possui uma base sólida, mas ainda há pequenos ajustes a serem feitos. Identifique as lacunas específicas e transforme-as em acertos.",
        icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
        color: "border-emerald-200 bg-emerald-50/50 text-emerald-900"
      };
    }
    if (score >= 50) {
      return {
        title: "Caminho Certo, Mas Atenção!",
        description: "Você já superou a barreira dos 50%, o que é um marco importante. No entanto, para ser aprovado, precisamos elevar esse patamar. Foque na revisão da teoria dos pontos onde houve erro.",
        icon: <Target className="w-8 h-8 text-blue-500" />,
        color: "border-blue-200 bg-blue-50/50 text-blue-900"
      };
    }
    return {
      title: "Momento de Reforçar a Base",
      description: "Este resultado indica que alguns conceitos fundamentais ainda não foram totalmente absorvidos. Não desanime! Use este simulado como um mapa para identificar o que precisa ser estudado do zero.",
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      color: "border-orange-200 bg-orange-50/50 text-orange-900"
    };
  };

  const { title, description, icon, color } = getMessage();

  return (
    <div className={cn("p-8 rounded-3xl border flex flex-col md:flex-row items-center gap-6", color)}>
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        {icon}
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-black uppercase tracking-tight mb-2">{title}</h3>
        <p className="font-medium leading-relaxed opacity-80">{description}</p>
      </div>
    </div>
  );
}
