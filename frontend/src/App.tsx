import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseViewPage from "./pages/CourseViewPage";
import QuizPage from "./pages/QuizPage";
import QuizzesPage from "./pages/QuizzesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import InstructorAnalyticsPage from "./pages/InstructorAnalyticsPage";
import StudentsPage from "./pages/StudentsPage";
import NotFound from "./pages/NotFound";
import AdminUsersPage     from './pages/admin/AdminUsersPage';
import AdminCoursesPage   from './pages/admin/AdminCoursesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage  from './pages/admin/AdminSettingsPage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
      <Route path="/course/:id" element={<ProtectedRoute><CourseViewPage /></ProtectedRoute>} />
      <Route path="/quiz/:id" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
      <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/instructor-analytics" element={<ProtectedRoute><InstructorAnalyticsPage /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
      {/* Admin routes use same dashboard */}
      <Route path="/admin/users"     element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/courses"   element={<ProtectedRoute><AdminCoursesPage /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />
      <Route path="/admin/settings"  element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
