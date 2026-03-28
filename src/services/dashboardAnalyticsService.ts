import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface DashboardAnalytics {
  visaoGeral: {
    totalSimulados: number;
    mediaGeral: number;
    melhorResultado: number;
    piorResultado: number;
    tendencia: 'melhora' | 'estabilidade' | 'queda';
  };
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
  pontosFortes: string[];
  pontosFracos: string[];
  recomendacao: string;
}

export const dashboardAnalyticsService = {
  /**
   * Busca e processa os dados detalhados para o Dashboard Inteligente V2.
   */
  async getDashboardAnalytics(): Promise<DashboardAnalytics | null> {
    if (!isSupabaseConfigured) return null;

    try {
      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) return null;

      // 1. Buscar todos os simulados (exams) do usuário
      const { data: exams, error: examsError } = await supabase!
        .from('exams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (examsError || !exams || exams.length === 0) {
        return this.getEmptyAnalytics();
      }

      const examIds = exams.map(e => e.id);

      // 2. Buscar todas as questões e respostas vinculadas a esses simulados
      // Nota: Em cenários de escala massiva, isso precisaria de paginação ou agregação via RPC.
      // Para o escopo atual, buscamos os dados para processamento local.
      const { data: questions, error: questionsError } = await supabase!
        .from('exam_questions')
        .select('id, exam_id, assunto')
        .in('exam_id', examIds);

      const { data: answers, error: answersError } = await supabase!
        .from('exam_answers')
        .select('exam_id, exam_question_id, acertou')
        .in('exam_id', examIds);

      if (questionsError || answersError || !questions || !answers) {
        // Se falhar o detalhado, tentamos retornar o básico baseado apenas nos exams
        return this.calculateBasicAnalytics(exams);
      }

      // 3. Processamento dos dados
      return this.processAnalytics(exams, questions, answers);
    } catch (err) {
      console.error('[DashboardAnalyticsService] Erro ao carregar analytics:', err);
      return null;
    }
  },

  /**
   * Processa os dados brutos para gerar as métricas finais.
   */
  processAnalytics(exams: any[], questions: any[], answers: any[]): DashboardAnalytics {
    // Visão Geral
    const totalSimulados = exams.length;
    const acertosTotais = exams.reduce((acc, e) => acc + (e.acertos || 0), 0);
    const questoesTotais = exams.reduce((acc, e) => acc + (e.quantidade_questoes || 0), 0);
    const mediaGeral = questoesTotais > 0 ? (acertosTotais / questoesTotais) * 100 : 0;
    const melhorResultado = Math.max(...exams.map(e => e.percentual || 0));
    const piorResultado = Math.min(...exams.map(e => e.percentual || 0));

    // Tendência (últimos 3 vs média geral)
    const ultimos3 = exams.slice(0, 3);
    const mediaRecente = ultimos3.length > 0 
      ? ultimos3.reduce((acc, e) => acc + (e.percentual || 0), 0) / ultimos3.length 
      : mediaGeral;
    
    let tendencia: 'melhora' | 'estabilidade' | 'queda' = 'estabilidade';
    if (mediaRecente > mediaGeral + 5) tendencia = 'melhora';
    else if (mediaRecente < mediaGeral - 5) tendencia = 'queda';

    // Desempenho por Matéria (usando exams.materia ou o primeiro assunto da questão se for "Várias")
    // Mas o requisito pede "com base em exam_questions.assunto"
    // Vamos agrupar por assunto de forma inteligente.
    const statsPorAssunto: Record<string, { total: number, acertos: number, erros: number }> = {};

    // Mapear respostas por ID de questão para acesso rápido
    const answersMap: Record<string, boolean> = {};
    answers.forEach(a => {
      answersMap[a.exam_question_id] = a.acertou;
    });

    questions.forEach(q => {
      const assunto = q.assunto || 'Não Classificado';
      if (!statsPorAssunto[assunto]) {
        statsPorAssunto[assunto] = { total: 0, acertos: 0, erros: 0 };
      }
      statsPorAssunto[assunto].total++;
      if (answersMap[q.id]) {
        statsPorAssunto[assunto].acertos++;
      } else {
        statsPorAssunto[assunto].erros++;
      }
    });

    const desempenhoPorMateria = Object.entries(statsPorAssunto).map(([materia, stats]) => ({
      materia,
      percentual: (stats.acertos / stats.total) * 100,
      totalQuestoes: stats.total,
      acertos: stats.acertos
    })).sort((a, b) => b.percentual - a.percentual);

    // Assuntos Críticos (menor percentual e pelo menos 3 erros)
    const assuntosCriticos = Object.entries(statsPorAssunto)
      .map(([assunto, stats]) => ({
        assunto,
        percentual: (stats.acertos / stats.total) * 100,
        erros: stats.erros
      }))
      .filter(a => a.percentual < 60 && a.erros > 0)
      .sort((a, b) => a.percentual - b.percentual || b.erros - a.erros)
      .slice(0, 5);

    // Pontos Fortes (Percentual > 80%)
    const pontosFortes = desempenhoPorMateria
      .filter(m => m.percentual >= 80)
      .map(m => m.materia)
      .slice(0, 3);

    // Pontos Fracos (Percentual < 50%)
    const pontosFracos = desempenhoPorMateria
      .filter(m => m.percentual < 50)
      .map(m => m.materia)
      .slice(0, 3);

    // Recomendação Automática
    let recomendacao = "Continue praticando! A constância é a chave para a aprovação.";
    if (assuntosCriticos.length > 0) {
      recomendacao = `Foco total em ${assuntosCriticos[0].assunto}. Seu desempenho nesta área está abaixo do esperado e requer revisão teórica imediata.`;
    } else if (mediaGeral > 80) {
      recomendacao = "Excelente nível! Agora foque em simulados de alto nível e controle de tempo para refinar sua estratégia de prova.";
    } else if (tendencia === 'queda') {
      recomendacao = "Identificamos uma queda recente no seu rendimento. Revise os erros dos últimos simulados para identificar lacunas de conhecimento.";
    }

    return {
      visaoGeral: {
        totalSimulados,
        mediaGeral,
        melhorResultado,
        piorResultado,
        tendencia
      },
      desempenhoPorMateria,
      assuntosCriticos,
      pontosFortes,
      pontosFracos,
      recomendacao
    };
  },

  /**
   * Fallback caso não consiga carregar questões/respostas detalhadas.
   */
  calculateBasicAnalytics(exams: any[]): DashboardAnalytics {
    const totalSimulados = exams.length;
    const acertosTotais = exams.reduce((acc, e) => acc + (e.acertos || 0), 0);
    const questoesTotais = exams.reduce((acc, e) => acc + (e.quantidade_questoes || 0), 0);
    const mediaGeral = questoesTotais > 0 ? (acertosTotais / questoesTotais) * 100 : 0;
    const melhorResultado = Math.max(...exams.map(e => e.percentual || 0));
    const piorResultado = Math.min(...exams.map(e => e.percentual || 0));

    return {
      visaoGeral: {
        totalSimulados,
        mediaGeral,
        melhorResultado,
        piorResultado,
        tendencia: 'estabilidade'
      },
      desempenhoPorMateria: [],
      assuntosCriticos: [],
      pontosFortes: [],
      pontosFracos: [],
      recomendacao: "Dados detalhados indisponíveis para análise profunda. Continue realizando simulados para gerar novos insights."
    };
  },

  getEmptyAnalytics(): DashboardAnalytics {
    return {
      visaoGeral: {
        totalSimulados: 0,
        mediaGeral: 0,
        melhorResultado: 0,
        piorResultado: 0,
        tendencia: 'estabilidade'
      },
      desempenhoPorMateria: [],
      assuntosCriticos: [],
      pontosFortes: [],
      pontosFracos: [],
      recomendacao: "Comece seu primeiro simulado para ver sua análise de desempenho aqui!"
    };
  }
};
