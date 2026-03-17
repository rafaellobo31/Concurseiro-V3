import { StudyPlanInput, StudyPlanOutput } from '../types/studyPlan';

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
  const hoursPerDay = parseInt(input.hoursPerDay) || 4;
  const daysPerWeek = parseInt(input.daysPerWeek) || 6;
  const totalHours = hoursPerDay * daysPerWeek;

  // Lógica simples para variar o conteúdo com base no tempo até a prova
  const isShortTime = input.timeUntilExam.toLowerCase().includes('mês') || 
                     input.timeUntilExam.toLowerCase().includes('meses') && parseInt(input.timeUntilExam) <= 2;
  
  const urgencyLevel = isShortTime ? 'Crítico' : 'Moderado';

  return {
    resumoEstrategico: {
      titulo: "Diretriz Estratégica de Alta Performance",
      descricao: `Para o certame ${input.concurso}, sua preparação deve ser pautada em ${isShortTime ? 'velocidade e revisão reativa' : 'consolidação de base e ganho de profundidade'}. Com ${input.hoursPerDay}h diárias, focaremos no núcleo duro do edital para garantir os pontos de corte iniciais.`
    },
    cargaSemanal: {
      horasTotais: totalHours,
      descricao: `Distribuição otimizada para ${totalHours} horas semanais, priorizando o ciclo PDCA (Planejar, Fazer, Checar, Agir).`,
      divisao: {
        teoria: isShortTime ? "25%" : "45%",
        questoes: isShortTime ? "55%" : "40%",
        revisao: isShortTime ? "20%" : "15%"
      }
    },
    gradeSemanal: [
      {
        dia: "Segunda-feira",
        blocos: [
          { materia: "Língua Portuguesa", duracao: "1.5h", foco: "Sintaxe do Período Composto e Pontuação" },
          { materia: "Direito Constitucional", duracao: "1.5h", foco: "Direitos e Deveres Individuais e Coletivos" },
          { materia: "Questões", duracao: "1h", foco: "Fixação dos temas do dia" }
        ]
      },
      {
        dia: "Terça-feira",
        blocos: [
          { materia: "Direito Administrativo", duracao: "2h", foco: "Atos Administrativos e Poderes da Administração" },
          { materia: "Raciocínio Lógico", duracao: "1.5h", foco: "Lógica de Proposições e Equivalências" },
          { materia: "Revisão", duracao: "0.5h", foco: "Flashcards dos temas de ontem" }
        ]
      },
      {
        dia: "Quarta-feira",
        blocos: [
          { materia: "Informática", duracao: "1.5h", foco: "Segurança da Informação e Redes" },
          { materia: "Matéria Específica I", duracao: "2h", foco: "Tópicos de maior peso do edital" },
          { materia: "Questões", duracao: "0.5h", foco: "Banca Organizadora" }
        ]
      },
      {
        dia: "Quinta-feira",
        blocos: [
          { materia: "Língua Portuguesa", duracao: "1.5h", foco: "Morfologia e Concordância" },
          { materia: "Direito Constitucional", duracao: "1.5h", foco: "Organização do Estado e dos Poderes" },
          { materia: "Revisão", duracao: "1h", foco: "Mapas Mentais da semana" }
        ]
      },
      {
        dia: "Sexta-feira",
        blocos: [
          { materia: "Direito Administrativo", duracao: "1.5h", foco: "Licitações e Contratos (Lei 14.133)" },
          { materia: "Matéria Específica II", duracao: "2h", foco: "Legislação Institucional" },
          { materia: "Questões", duracao: "0.5h", foco: "Simulado de 20 questões" }
        ]
      },
      {
        dia: "Sábado",
        blocos: [
          { materia: "Revisão Geral", duracao: "2h", foco: "Revisão de todos os pontos de erro da semana" },
          { materia: "Simulado de Prova", duracao: "2h", foco: "Simulação de tempo real de prova" }
        ]
      },
      {
        dia: "Domingo",
        blocos: [
          { materia: "Descanso Estratégico", duracao: "0h", foco: "Recuperação cognitiva para a próxima semana" }
        ]
      }
    ].slice(0, Math.min(daysPerWeek, 7)),
    materiasPrioritarias: [
      {
        nome: "Língua Portuguesa",
        peso: "alto",
        justificativa: "Geralmente representa 20% da nota total e é o principal critério de desempate."
      },
      {
        nome: "Direito Administrativo",
        peso: "alto",
        justificativa: "Matéria com alto índice de pegadinhas doutrinárias e jurisprudenciais."
      },
      {
        nome: "Conhecimentos Específicos",
        peso: "alto",
        justificativa: "Possui o maior peso por questão e define a classificação final."
      }
    ],
    termometroQuestoes: {
      intensidade: isShortTime ? "intensa" : "alta",
      metaSemanal: isShortTime ? "400 questões" : "200 questões",
      justificativa: `Dada a urgência ${urgencyLevel}, a resolução de questões é o termômetro real da sua evolução e o melhor método de revisão ativa.`
    },
    assuntosPrincipais: [
      {
        materia: "Língua Portuguesa",
        topicos: ["Interpretação de Textos", "Sintaxe", "Pontuação", "Crase"]
      },
      {
        materia: "Direito Constitucional",
        topicos: ["Artigo 5º", "Remédios Constitucionais", "Organização dos Poderes"]
      },
      {
        materia: "Direito Administrativo",
        topicos: ["Atos Administrativos", "Licitações", "Agentes Públicos"]
      }
    ],
    estrategiaBanca: {
      banca: "Perfil de Excelência",
      perfil: "A banca tende a cobrar a literalidade da lei com foco em prazos e exceções.",
      metodologia: "Estudo reverso: partir das questões para a teoria nos pontos de maior erro."
    },
    cicloRevisao: {
      curta: "Revisão de 10 minutos no início de cada bloco sobre o que foi estudado no bloco anterior.",
      semanal: "Sábados focados em transformar erros de questões em novos materiais de revisão.",
      acumulada: "A cada 21 dias, um dia inteiro dedicado apenas a revisar os temas de maior peso."
    },
    orientacaoFinal: {
      mensagem: "A constância vence o talento. Siga o plano com 1% de melhora a cada dia e o resultado será inevitável.",
      errosEvitar: [
        "Estudar apenas o que já domina",
        "Pular as revisões programadas",
        "Não cronometrar o tempo de estudo líquido",
        "Negligenciar a resolução de questões da banca"
      ]
    }
  };
};
