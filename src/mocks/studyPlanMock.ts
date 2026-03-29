import { StudyPlanInput, StudyPlanOutput } from '../types/studyPlan.js';

export const CONCURSOS_LIST = [
  'INSS',
  'Banco do Brasil',
  'Petrobras',
  'CNU',
  'Polícia Federal',
  'Caixa',
  'Correios',
  'IBGE'
];

/**
 * Gera um plano de estudos mockado com profundidade estratégica.
 * Utilizado como fallback quando a IA não está configurada ou para testes.
 */
export const generateMockStudyPlan = (input: StudyPlanInput): StudyPlanOutput => {
  const hasPerformance = !!input.performanceData;
  
  return {
    prioridades: [
      {
        materia: hasPerformance && input.performanceData!.desempenhoPorMateria.length > 0 
          ? input.performanceData!.desempenhoPorMateria[input.performanceData!.desempenhoPorMateria.length - 1].materia 
          : "Língua Portuguesa",
        nivelPrioridade: "Alta",
        motivo: hasPerformance 
          ? "Seu desempenho nesta matéria está abaixo da média geral, exigindo reforço imediato."
          : "Matéria de base com alto peso em editais de concursos públicos."
      },
      {
        materia: "Direito Administrativo",
        nivelPrioridade: "Média",
        motivo: "Conteúdo extenso com alta recorrência de pegadinhas doutrinárias."
      }
    ],
    planoSemanal: [
      {
        dia: "Segunda-feira",
        atividades: [
          { materia: "Língua Portuguesa", tempo: "1h 30min", tipo: "teoria" },
          { materia: "Direito Constitucional", tempo: "1h 30min", tipo: "revisão" }
        ]
      },
      {
        dia: "Terça-feira",
        atividades: [
          { materia: "Direito Administrativo", tempo: "2h", tipo: "teoria" },
          { materia: "Questões Gerais", tempo: "1h", tipo: "revisão" }
        ]
      },
      {
        dia: "Quarta-feira",
        atividades: [
          { materia: "Informática", tempo: "1h 30min", tipo: "teoria" },
          { materia: "Simulado Curto", tempo: "1h 30min", tipo: "simulado" }
        ]
      }
    ],
    recomendacoes: [
      "Mantenha a constância: 1% de melhora a cada dia gera resultados exponenciais.",
      "Não pule as revisões: o cérebro precisa de repetição para consolidar o aprendizado.",
      "Foque nos seus erros: cada erro em simulado é uma oportunidade de não errar na prova."
    ]
  };
};
