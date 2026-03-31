import { historyService } from './historyService';
import { DashboardMetrics } from '../types/dashboard';
import { dashboardAnalyticsService } from './dashboardAnalyticsService';

export const dashboardService = {
  /**
   * Calcula as métricas do dashboard com base no histórico real e análise detalhada V2.
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    console.log('[DashboardService] getDashboardMetrics iniciado.');
    
    try {
      // Add a safety timeout for the whole operation
      const metricsPromise = (async () => {
        const history = await historyService.getHistoryItems();
        const analyticsV2 = await dashboardAnalyticsService.getDashboardAnalytics();
        return { history, analyticsV2 };
      })();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao carregar métricas do dashboard')), 8000)
      );

      const { history, analyticsV2 } = await Promise.race([metricsPromise, timeoutPromise]) as any;
      console.log('[DashboardService] Dados carregados. Histórico:', history.length, 'Analytics:', !!analyticsV2);
      
      if (history.length === 0 || !analyticsV2) {
        console.log('[DashboardService] Retornando métricas vazias.');
        return this.getEmptyMetrics();
      }

    const totalSimulados = analyticsV2.visaoGeral.totalSimulados;
    const mediaPercentual = analyticsV2.visaoGeral.mediaGeral;
    const melhorPercentual = analyticsV2.visaoGeral.melhorResultado;
    const piorPercentual = analyticsV2.visaoGeral.piorResultado;
    const ultimoPercentual = history[0]?.percentual || 0;
    const atividadeRecente = history.slice(0, 5);
    const tendenciaRecente = analyticsV2.visaoGeral.tendencia;

    // Agrupar por concurso (usando history para manter compatibilidade)
    const performanceByConcurso: Record<string, { total: number, acertos: number }> = {};
    history.forEach(h => {
      if (h.concurso && h.concurso !== 'N/A' && h.concurso.trim() !== '') {
        if (!performanceByConcurso[h.concurso]) performanceByConcurso[h.concurso] = { total: 0, acertos: 0 };
        performanceByConcurso[h.concurso].total += h.quantidadeQuestoes;
        performanceByConcurso[h.concurso].acertos += h.acertos;
      }
    });

    const concursos = Object.entries(performanceByConcurso).map(([nome, stats]) => ({
      nome,
      percentual: (stats.acertos / stats.total) * 100
    })).sort((a, b) => b.percentual - a.percentual);

    const analisePorConcurso = {
      melhor: concursos.length > 0 ? concursos[0] : null,
      pior: concursos.length > 1 ? concursos[concursos.length - 1] : null
    };

    const analisePorMateria = {
      melhor: analyticsV2.desempenhoPorMateria.length > 0 ? {
        nome: analyticsV2.desempenhoPorMateria[0].materia,
        percentual: analyticsV2.desempenhoPorMateria[0].percentual
      } : null,
      pior: analyticsV2.desempenhoPorMateria.length > 1 ? {
        nome: analyticsV2.desempenhoPorMateria[analyticsV2.desempenhoPorMateria.length - 1].materia,
        percentual: analyticsV2.desempenhoPorMateria[analyticsV2.desempenhoPorMateria.length - 1].percentual
      } : null
    };

      // Consolidar Insights
      const pontosFortes = [...analyticsV2.pontosFortes];
      const pontosFracos = [...analyticsV2.pontosFracos];
      const recomendacoes = [analyticsV2.recomendacao];

      // Adicionar recomendações extras baseadas em concursos se houver
      if (analisePorConcurso.pior && analisePorConcurso.pior.percentual < 50) {
        recomendacoes.push(`Atenção especial ao concurso ${analisePorConcurso.pior.nome}.`);
      }

      return {
        totalSimulados,
        mediaPercentual,
        melhorPercentual,
        piorPercentual,
        ultimoPercentual,
        totalQuestoesRespondidas: history.reduce((acc: number, curr: any) => acc + curr.quantidadeQuestoes, 0),
        totalAcertos: history.reduce((acc: number, curr: any) => acc + curr.acertos, 0),
        totalErros: history.reduce((acc: number, curr: any) => acc + curr.erros, 0),
        atividadeRecente,
        tendenciaRecente,
        analisePorMateria,
        analisePorConcurso,
        insights: {
          pontosFortes: pontosFortes.slice(0, 3),
          pontosFracos: pontosFracos.slice(0, 3),
          recomendacoes: recomendacoes.slice(0, 3)
        },
        assuntosCriticos: analyticsV2.assuntosCriticos,
        desempenhoPorMateria: analyticsV2.desempenhoPorMateria
      };
    } catch (err) {
      console.error('[DashboardService] Erro ao carregar métricas:', err);
      return this.getEmptyMetrics();
    }
  },

  getEmptyMetrics(): DashboardMetrics {
    return {
      totalSimulados: 0,
      mediaPercentual: 0,
      melhorPercentual: 0,
      piorPercentual: 0,
      ultimoPercentual: 0,
      totalQuestoesRespondidas: 0,
      totalAcertos: 0,
      totalErros: 0,
      atividadeRecente: [],
      tendenciaRecente: 'estabilidade',
      analisePorMateria: { melhor: null, pior: null },
      analisePorConcurso: { melhor: null, pior: null },
      insights: {
        pontosFortes: [],
        pontosFracos: [],
        recomendacoes: []
      },
      assuntosCriticos: [],
      desempenhoPorMateria: []
    };
  }
};
