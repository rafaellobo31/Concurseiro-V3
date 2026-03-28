import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import { DashboardMetrics } from '../types/dashboard';
import { DashboardSummaryCard } from '../components/dashboard/DashboardSummaryCard';
import { DashboardStatsGrid } from '../components/dashboard/DashboardStatsGrid';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { PerformanceInsightsCard } from '../components/dashboard/PerformanceInsightsCard';
import { PerformanceAnalysisGrid } from '../components/dashboard/PerformanceAnalysisGrid';
import { CriticalTopicsCard } from '../components/dashboard/CriticalTopicsCard';
import { QuickActionsCard } from '../components/dashboard/QuickActionsCard';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { FeedbackMessage } from '../components/ui/FeedbackMessage';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (authLoading) return;
      
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
        setError('Não foi possível carregar os dados do seu dashboard. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingState message="Calculando suas métricas de desempenho..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <FeedbackMessage 
          type="error" 
          title="Erro de Carregamento" 
          message={error} 
        />
      </div>
    );
  }

  if (!metrics || metrics.totalSimulados === 0) {
    return <DashboardEmptyState userName={user?.name} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Dashboard Estratégico
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Olá, {user?.name}! 👋</h1>
          <p className="text-gray-500 font-medium text-lg">Aqui está uma visão detalhada da sua jornada rumo à aprovação.</p>
        </div>
      </header>

      {/* Main Summary Stats */}
      <DashboardSummaryCard metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardStatsGrid metrics={metrics} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CriticalTopicsCard assuntos={metrics.assuntosCriticos} />
            <PerformanceInsightsCard insights={metrics.insights} />
          </div>
          <PerformanceAnalysisGrid metrics={metrics} />
        </div>

        {/* Right Column: Activity & Actions */}
        <div className="space-y-8">
          <QuickActionsCard />
          <RecentActivityCard activities={metrics.atividadeRecente} />
        </div>
      </div>
    </div>
  );
}
