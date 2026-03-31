import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SimuladosPage from './pages/SimuladosPage';
import StudyPlanPage from './pages/StudyPlanPage';
import ExamSessionPage from './pages/ExamSessionPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import EditalSimuladoPage from './pages/EditalSimuladoPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          {/* Protected Routes (Mocked for now) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/simulados" element={<SimuladosPage />} />
            <Route path="/study-plan" element={<StudyPlanPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<HistoryDetailPage />} />
            <Route path="/edital-simulado" element={<EditalSimuladoPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Full Screen Exam Session - Unified Route */}
          <Route path="/exam-session/:id?" element={<ExamSessionPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
