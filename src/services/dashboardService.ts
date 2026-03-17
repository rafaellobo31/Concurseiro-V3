import { historyService } from './historyService';
import { DashboardMetrics } from '../types/dashboard';

export const dashboardService = {
  /**
   * Calcula as métricas do dashboard com base no histórico real.
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const history = await historyService.getHistoryItems();
    
    if (history.length === 0) {
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
        }
      };
    }

    const totalSimulados = history.length;
    const totalQuestoesRespondidas = history.reduce((acc, curr) => acc + curr.quantidadeQuestoes, 0);
    const totalAcertos = history.reduce((acc, curr) => acc + curr.acertos, 0);
    const totalErros = history.reduce((acc, curr) => acc + curr.erros, 0);
    const mediaPercentual = (totalAcertos / totalQuestoesRespondidas) * 100;
    const melhorPercentual = Math.max(...history.map(h => h.percentual));
    const piorPercentual = Math.min(...history.map(h => h.percentual));
    const ultimoPercentual = history[0].percentual;
    const atividadeRecente = history.slice(0, 5);

    // Função auxiliar para classificação de desempenho
    const getStatus = (percent: number) => {
      if (percent < 40) return 'Crítico';
      if (percent < 60) return 'Atenção';
      if (percent < 80) return 'Bom';
      return 'Forte';
    };

    // Tendência Recente (comparar últimos 3 simulados com a média geral)
    // Regra: diff > +5 = melhora, diff < -5 = queda, else estável
    const ultimosSimulados = history.slice(0, 3);
    const mediaRecente = ultimosSimulados.reduce((acc, curr) => acc + curr.percentual, 0) / ultimosSimulados.length;
    let tendenciaRecente: 'melhora' | 'estabilidade' | 'queda' = 'estabilidade';
    
    if (mediaRecente > mediaPercentual + 5) tendenciaRecente = 'melhora';
    else if (mediaRecente < mediaPercentual - 5) tendenciaRecente = 'queda';

    // Agrupar por matéria e concurso (ignorando N/A e vazios)
    const performanceBySubject: Record<string, { total: number, acertos: number }> = {};
    const performanceByConcurso: Record<string, { total: number, acertos: number }> = {};

    history.forEach(h => {
      if (h.materia && h.materia !== 'N/A' && h.materia.trim() !== '') {
        if (!performanceBySubject[h.materia]) performanceBySubject[h.materia] = { total: 0, acertos: 0 };
        performanceBySubject[h.materia].total += h.quantidadeQuestoes;
        performanceBySubject[h.materia].acertos += h.acertos;
      }
      
      if (h.concurso && h.concurso !== 'N/A' && h.concurso.trim() !== '') {
        if (!performanceByConcurso[h.concurso]) performanceByConcurso[h.concurso] = { total: 0, acertos: 0 };
        performanceByConcurso[h.concurso].total += h.quantidadeQuestoes;
        performanceByConcurso[h.concurso].acertos += h.acertos;
      }
    });

    const subjects = Object.entries(performanceBySubject).map(([nome, stats]) => ({
      nome,
      percentual: (stats.acertos / stats.total) * 100
    })).sort((a, b) => b.percentual - a.percentual);

    const concursos = Object.entries(performanceByConcurso).map(([nome, stats]) => ({
      nome,
      percentual: (stats.acertos / stats.total) * 100
    })).sort((a, b) => b.percentual - a.percentual);

    const analisePorMateria = {
      melhor: subjects.length > 0 ? subjects[0] : null,
      pior: subjects.length > 1 ? subjects[subjects.length - 1] : null
    };

    const analisePorConcurso = {
      melhor: concursos.length > 0 ? concursos[0] : null,
      pior: concursos.length > 1 ? concursos[concursos.length - 1] : null
    };

    // Geração de Insights Inteligentes
    const pontosFortes: string[] = [];
    const pontosFracos: string[] = [];
    const recomendacoes: string[] = [];

    // 1. Pontos Fortes (Máximo 3)
    if (analisePorMateria.melhor && analisePorMateria.melhor.percentual >= 60) {
      pontosFortes.push(`Desempenho ${getStatus(analisePorMateria.melhor.percentual)} em ${analisePorMateria.melhor.nome} (${analisePorMateria.melhor.percentual.toFixed(0)}%)`);
    }

    if (mediaPercentual >= 60) {
      pontosFortes.push(`Média Geral consolidada como ${getStatus(mediaPercentual)} (${mediaPercentual.toFixed(0)}%)`);
    }

    if (tendenciaRecente === 'melhora') {
      pontosFortes.push("Sinal de evolução: tendência de melhora nos resultados recentes");
    }

    // 2. Onde Melhorar (Máximo 3)
    if (analisePorMateria.pior && analisePorMateria.pior.percentual < 60) {
      pontosFracos.push(`Nível ${getStatus(analisePorMateria.pior.percentual)} em ${analisePorMateria.pior.nome} (${analisePorMateria.pior.percentual.toFixed(0)}%)`);
    }

    if (analisePorConcurso.pior && analisePorConcurso.pior.percentual < 60) {
      pontosFracos.push(`Foco necessário no concurso ${analisePorConcurso.pior.nome} (${analisePorConcurso.pior.percentual.toFixed(0)}%)`);
    }

    if (tendenciaRecente === 'queda') {
      pontosFracos.push("Alerta: queda de rendimento identificada nos últimos simulados");
    }

    // Se ainda houver espaço e tivermos temas de revisão
    if (pontosFracos.length < 3) {
      const temasParaReforco = new Set<string>();
      history.slice(0, 5).forEach(h => {
        h.assuntosParaRevisao?.forEach(tema => temasParaReforco.add(tema));
      });
      if (temasParaReforco.size > 0) {
        const listaTemas = Array.from(temasParaReforco).slice(0, 2).join(", ");
        pontosFracos.push(`Reforçar temas: ${listaTemas}`);
      }
    }

    // 3. Recomendações Práticas
    if (mediaPercentual < 40) {
      recomendacoes.push("Priorize o estudo da base teórica antes de focar em simulados de alta complexidade.");
    } else if (mediaPercentual < 60) {
      recomendacoes.push("Aumente o volume de questões comentadas para entender as pegadinhas da banca.");
    }

    if (analisePorMateria.pior && analisePorMateria.pior.percentual < 50) {
      recomendacoes.push(`Dedique um ciclo de estudos extra para ${analisePorMateria.pior.nome} nesta semana.`);
    }

    if (tendenciaRecente === 'queda') {
      recomendacoes.push("Revise os erros dos últimos 3 simulados para estancar a queda de rendimento.");
    }

    if (totalSimulados >= 5 && mediaPercentual >= 70) {
      recomendacoes.push("Mantenha o ritmo e comece a focar em simulados de nível 'Difícil' para subir o sarrafo.");
    }

    return {
      totalSimulados,
      mediaPercentual,
      melhorPercentual,
      piorPercentual,
      ultimoPercentual,
      totalQuestoesRespondidas,
      totalAcertos,
      totalErros,
      atividadeRecente,
      tendenciaRecente,
      analisePorMateria,
      analisePorConcurso,
      insights: {
        pontosFortes: pontosFortes.slice(0, 3),
        pontosFracos: pontosFracos.slice(0, 3),
        recomendacoes: recomendacoes.slice(0, 3)
      }
    };
  }
};
