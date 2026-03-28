import { useState, useEffect, useMemo } from 'react';
import { historyService } from '../services/historyService';
import { SimuladoHistoryItem, HistoryStats } from '../types/history';
import { HistorySummaryCard } from '../components/history/HistorySummaryCard';
import { HistoryList } from '../components/history/HistoryList';
import { HistoryFilterBar } from '../components/history/HistoryFilterBar';
import { HistoryEmptyState } from '../components/history/HistoryEmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { FeedbackMessage } from '../components/ui/FeedbackMessage';
import { Trash2, BarChart3, Clock, SearchX } from 'lucide-react';
import { motion } from 'motion/react';

export default function HistoryPage() {
  const [history, setHistory] = useState<SimuladoHistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [historyData, statsData] = await Promise.all([
          historyService.getHistoryItems(),
          historyService.getStats()
        ]);
        setHistory(historyData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Error loading history:', err);
        setError('Não foi possível carregar seu histórico de simulados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter(record => {
      const matchesSearch = 
        (record.concurso?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         record.materia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         record.area?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesMode = filterMode === 'all' || record.mode === filterMode;
      
      return matchesSearch && matchesMode;
    });
  }, [history, searchTerm, filterMode]);

  const handleClearHistory = async () => {
    if (window.confirm('Tem certeza que deseja limpar todo o seu histórico? Esta ação não pode ser desfeita.')) {
      try {
        await historyService.clearHistory();
        setHistory([]);
        setStats({
          totalSimulados: 0,
          mediaAcertos: 0,
          totalQuestoes: 0,
          totalAcertos: 0,
        });
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingState message="Carregando seu histórico de simulados..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <FeedbackMessage 
          type="error" 
          title="Erro ao carregar histórico" 
          message={error} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              Sua Jornada de Estudos
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Histórico de Simulados</h1>
            <p className="text-gray-500 font-medium max-w-xl text-lg">
              Acompanhe seu progresso, analise seus erros e veja como sua performance está evoluindo.
            </p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-6 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all border border-transparent hover:border-red-100 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Histórico
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <>
            {/* Stats Summary */}
            {stats && <HistorySummaryCard stats={stats} />}

            {/* Filters & List */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-gray-900 font-bold">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl">Detalhamento por Simulado</h3>
              </div>
              
              <HistoryFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterMode={filterMode}
                onFilterChange={setFilterMode}
              />

              {filteredHistory.length > 0 ? (
                <HistoryList records={filteredHistory} />
              ) : (
                <EmptyState 
                  icon={SearchX}
                  title="Nenhum resultado encontrado"
                  description="Não encontramos simulados que correspondam aos seus filtros de busca. Tente ajustar os termos ou filtros."
                />
              )}
            </div>
          </>
        ) : (
          <HistoryEmptyState />
        )}
      </div>
    </div>
  );
}
