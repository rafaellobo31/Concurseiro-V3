import { useState, useEffect, useMemo } from 'react';
import { historyService } from '../services/historyService';
import { SimuladoHistoryItem, HistoryStats } from '../types/history';
import { HistorySummaryCard } from '../components/history/HistorySummaryCard';
import { HistoryList } from '../components/history/HistoryList';
import { HistoryFilterBar } from '../components/history/HistoryFilterBar';
import { HistoryEmptyState } from '../components/history/HistoryEmptyState';
import { Trash2, BarChart3, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function HistoryPage() {
  const [history, setHistory] = useState<SimuladoHistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    async function loadData() {
      const [historyData, statsData] = await Promise.all([
        historyService.getHistoryItems(),
        historyService.getStats()
      ]);
      setHistory(historyData);
      setStats(statsData);
      setLoading(false);
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
      await historyService.clearHistory();
      setHistory([]);
      setStats({
        totalSimulados: 0,
        mediaAcertos: 0,
        totalQuestoes: 0,
        totalAcertos: 0,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              Sua Jornada de Estudos
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Histórico de Simulados</h1>
            <p className="text-gray-500 font-medium max-w-xl">
              Acompanhe seu progresso, analise seus erros e veja como sua performance está evoluindo ao longo do tempo.
            </p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors"
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
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <h3>Detalhamento por Simulado</h3>
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
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-2">
                  <p className="text-gray-900 font-bold">Nenhum resultado encontrado</p>
                  <p className="text-gray-500 text-sm">Tente ajustar seus filtros de busca.</p>
                </div>
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
