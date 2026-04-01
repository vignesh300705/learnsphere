import api from '@/lib/api';

export const analyticsService = {
  getStudentAnalytics: async () => {
    const res = await api.get('/analytics/student');
    return res.data;
  },
  getInstructorAnalytics: async () => {
    const res = await api.get('/analytics/instructor');
    return res.data;
  },
  getLeaderboard: async () => {
    const res = await api.get('/analytics/leaderboard');
    return res.data;
  },
  getAllStudents: async () => {
    const res = await api.get('/analytics/students');
    return res.data;
  },
  getRecommendations: async () => {
    const res = await api.get('/analytics/recommendations');
    return res.data;
  },
  getAdminAnalytics: async () => {
    const res = await api.get('/analytics/admin');
    return res.data;
  },
};