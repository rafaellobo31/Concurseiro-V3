import { SimuladoHistoryItem, HistoryStats } from '../types/history';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'concurseiro_history';

export const historyService = {
  /**
   * Salva um novo registro de histórico.
   */
  async saveHistoryItem(record: Omit<SimuladoHistoryItem, 'id' | 'createdAt'>): Promise<SimuladoHistoryItem> {
    const newRecord: SimuladoHistoryItem = {
      ...record,
      id: `hist-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    console.log('[HistoryService] Iniciando salvamento de item:', newRecord);

    // Tenta salvar no Supabase se estiver configurado e o usuário estiver logado
    if (isSupabaseConfigured) {
      try {
        const { data: { user }, error: userError } = await supabase!.auth.getUser();
        console.log('[HistoryService] Usuário autenticado:', user);
        
        if (userError) {
          console.error('[HistoryService] Erro ao obter usuário:', userError);
        }

        if (user) {
          const supabaseData = {
            user_id: user.id,
            mode: newRecord.mode,
            tipo_questao: newRecord.tipoQuestao,
            origem_questoes: newRecord.origemQuestoes,
            concurso: newRecord.concurso,
            materia: newRecord.materia,
            area: newRecord.area,
            banca: newRecord.banca,
            quantidade_questoes: newRecord.quantidadeQuestoes,
            acertos: newRecord.acertos,
            erros: newRecord.erros,
            percentual: newRecord.percentual,
            nivel_desempenho: newRecord.nivelDesempenho,
            mensagem_resumo: newRecord.mensagemResumo,
            assuntos_revisao: newRecord.assuntosParaRevisao,
          };

          console.log('[HistoryService] Payload enviado para Supabase:', supabaseData);

          const { data, error } = await supabase!
            .from('simulado_history')
            .insert(supabaseData)
            .select()
            .single();

          if (error) {
            console.error('[HistoryService] Erro retornado pelo Supabase:', error);
          } else {
            console.log('[HistoryService] Resultado do insert:', data);
            if (data) {
              return {
                ...newRecord,
                id: data.id,
                createdAt: data.created_at
              };
            }
          }
        } else {
          console.warn('[HistoryService] Nenhum usuário autenticado no Supabase, usando fallback local.');
        }
      } catch (err) {
        console.error('[HistoryService] Erro inesperado na integração com Supabase:', err);
      }
    } else {
      console.log('[HistoryService] Supabase não configurado, usando fallback local.');
    }

    // Fallback para localStorage
    const history = await this.getHistoryItems();
    const updatedHistory = [newRecord, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    console.log('[HistoryService] Item salvo localmente (fallback).');

    return newRecord;
  },

  /**
   * Retorna a lista completa de histórico.
   */
  async getHistoryItems(): Promise<SimuladoHistoryItem[]> {
    // Tenta buscar do Supabase se estiver configurado e o usuário estiver logado
    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase!.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase!
            .from('simulado_history')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            return data.map((item: any) => ({
              id: item.id,
              createdAt: item.created_at,
              mode: item.mode,
              tipoQuestao: item.tipo_questao,
              origemQuestoes: item.origem_questoes,
              concurso: item.concurso,
              materia: item.materia,
              area: item.area,
              banca: item.banca,
              quantidadeQuestoes: item.quantidade_questoes,
              acertos: item.acertos,
              erros: item.erros,
              percentual: item.percentual,
              nivelDesempenho: item.nivel_desempenho,
              mensagemResumo: item.mensagem_resumo,
              assuntosParaRevisao: item.assuntos_revisao,
            }));
          } else if (error) {
            console.error('[HistoryService] Erro ao buscar do Supabase:', error);
          }
        }
      } catch (err) {
        console.error('[HistoryService] Erro inesperado ao buscar histórico do Supabase:', err);
      }
    }

    // Fallback para localStorage
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('[HistoryService] Erro ao ler histórico do localStorage', e);
      return [];
    }
  },

  /**
   * Busca um item específico pelo ID.
   */
  async getHistoryItemById(id: string): Promise<SimuladoHistoryItem | null> {
    const history = await this.getHistoryItems();
    return history.find(r => r.id === id) || null;
  },

  /**
   * Limpa todo o histórico.
   */
  async clearHistory(): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase!.auth.getUser();
        if (user) {
          const { error } = await supabase!
            .from('simulado_history')
            .delete()
            .eq('user_id', user.id);
          
          if (!error) {
            console.log('[HistoryService] Histórico limpo no Supabase.');
            return;
          }
          console.error('[HistoryService] Erro ao limpar histórico no Supabase:', error);
        }
      } catch (err) {
        console.error('[HistoryService] Erro inesperado ao limpar histórico no Supabase:', err);
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    console.log('[HistoryService] Histórico limpo localmente.');
  },

  /**
   * Calcula estatísticas baseadas no histórico.
   */
  async getStats(): Promise<HistoryStats> {
    const history = await this.getHistoryItems();
    if (history.length === 0) {
      return {
        totalSimulados: 0,
        mediaAcertos: 0,
        totalQuestoes: 0,
        totalAcertos: 0,
      };
    }

    const totalQuestoes = history.reduce((acc, curr) => acc + curr.quantidadeQuestoes, 0);
    const totalAcertos = history.reduce((acc, curr) => acc + curr.acertos, 0);
    
    // Simulação de melhor/pior matéria
    const materiasMap: Record<string, { total: number, acertos: number }> = {};
    history.forEach(r => {
      const key = r.materia || r.concurso || 'Geral';
      if (!materiasMap[key]) materiasMap[key] = { total: 0, acertos: 0 };
      materiasMap[key].total += r.quantidadeQuestoes;
      materiasMap[key].acertos += r.acertos;
    });

    let melhorMateria = '';
    let melhorTaxa = -1;
    let piorMateria = '';
    let piorTaxa = 101;

    Object.entries(materiasMap).forEach(([materia, stats]) => {
      const taxa = (stats.acertos / stats.total) * 100;
      if (taxa > melhorTaxa) {
        melhorTaxa = taxa;
        melhorMateria = materia;
      }
      if (taxa < piorTaxa) {
        piorTaxa = taxa;
        piorMateria = materia;
      }
    });

    return {
      totalSimulados: history.length,
      mediaAcertos: (totalAcertos / totalQuestoes) * 100,
      totalQuestoes,
      totalAcertos,
      melhorMateria,
      piorMateria
    };
  }
};
