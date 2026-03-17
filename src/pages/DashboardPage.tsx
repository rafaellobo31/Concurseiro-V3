import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import { DashboardMetrics } from '../types/dashboard';
import { DashboardSummaryCard } from '../components/dashboard/DashboardSummaryCard';
import { DashboardStatsGrid } from '../components/dashboard/DashboardStatsGrid';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { PerformanceInsightsCard } from '../components/dashboard/PerformanceInsightsCard';
import { PerformanceAnalysisGrid } from '../components/dashboard/PerformanceAnalysisGrid';
import { QuickActionsCard } from '../components/dashboard/QuickActionsCard';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (authLoading) return;
      
      try {
        const data = await dashboardService.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!metrics || metrics.totalSimulados === 0) {
    return <DashboardEmptyState userName={user?.name} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Dashboard Estratégico
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Olá, {user?.name}! 👋</h1>
          <p className="text-gray-500 font-medium">Aqui está uma visão geral do seu desempenho nos estudos.</p>
        </div>
      </header>

      {/* Main Summary Stats */}
      <DashboardSummaryCard metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardStatsGrid metrics={metrics} />
          <PerformanceAnalysisGrid metrics={metrics} />
          <PerformanceInsightsCard insights={metrics.insights} />
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
