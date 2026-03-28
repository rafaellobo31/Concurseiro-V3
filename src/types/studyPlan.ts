export type StudyPlanInput = {
  concurso: string;
  hoursPerDay: string;
  daysPerWeek: string;
  timeUntilExam: string;
  performanceData?: {
    mediaGeral: number;
    desempenhoPorMateria: {
      materia: string;
      percentual: number;
      totalQuestoes: number;
      acertos: number;
    }[];
    assuntosCriticos: {
      assunto: string;
      percentual: number;
      erros: number;
    }[];
  };
};

export type StudyPlanOutput = {
  prioridades: {
    materia: string;
    nivelPrioridade: 'Alta' | 'Média' | 'Baixa';
    motivo: string;
  }[];
  planoSemanal: {
    dia: string;
    atividades: {
      materia: string;
      tempo: string;
      tipo: 'teoria' | 'revisão' | 'simulado';
    }[];
  }[];
  recomendacoes: string[];
};
