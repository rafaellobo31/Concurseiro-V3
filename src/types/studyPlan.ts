export type StudyPlanInput = {
  concurso: string;
  hoursPerDay: string;
  daysPerWeek: string;
  timeUntilExam: string;
};

export type StudyBlock = {
  materia: string;
  duracao: string;
  foco: string;
};

export type WeeklyScheduleItem = {
  dia: string;
  blocos: StudyBlock[];
};

export type WeeklySchedule = WeeklyScheduleItem[];

export type PrioritySubject = {
  nome: string;
  peso: 'baixo' | 'médio' | 'alto';
  justificativa: string;
};

export type QuestionsThermometer = {
  intensidade: 'baixa' | 'moderada' | 'alta' | 'intensa';
  metaSemanal: string;
  justificativa: string;
};

export type BankStrategy = {
  banca: string;
  perfil: string;
  metodologia: string;
};

export type ReviewCycle = {
  curta: string;
  semanal: string;
  acumulada: string;
};

export type MainTopic = {
  materia: string;
  topicos: string[];
};

export type StrategicSummary = {
  titulo: string;
  descricao: string;
};

export type WeeklyLoad = {
  horasTotais: number;
  descricao: string;
  divisao: {
    teoria: string;
    questoes: string;
    revisao: string;
  };
};

export type FinalOrientation = {
  mensagem: string;
  errosEvitar: string[];
};

export type StudyPlanOutput = {
  resumoEstrategico: StrategicSummary;
  cargaSemanal: WeeklyLoad;
  gradeSemanal: WeeklySchedule;
  materiasPrioritarias: PrioritySubject[];
  termometroQuestoes: QuestionsThermometer;
  assuntosPrincipais: MainTopic[];
  estrategiaBanca: BankStrategy;
  cicloRevisao: ReviewCycle;
  orientacaoFinal: FinalOrientation;
};
