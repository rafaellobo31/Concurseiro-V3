import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlan } from '../hooks/usePlan';
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
import { Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { isFree } = usePlan();
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
            <div className="relative">
              <PerformanceInsightsCard insights={metrics.insights} />
              {isFree && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 border border-indigo-100">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Lock size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900">Insights Estratégicos</h3>
                    <p className="text-xs text-gray-500 max-w-[200px]">
                      Análise completa disponível no plano Pro.
                    </p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Seja Pro
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <PerformanceAnalysisGrid metrics={metrics} />
            {isFree && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-10 text-center space-y-4 z-10 border border-indigo-100">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Lock size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">Análise Pedagógica Completa</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Desbloqueie o acompanhamento detalhado de evolução por matéria e tempo de estudo.
                  </p>
                </div>
                <Link 
                  to="/profile" 
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Fazer Upgrade para Pro
                </Link>
              </div>
            )}
          </div>
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
