import api from '@/lib/api';

export const quizService = {
  getAllQuizzes: async () => {
    const res = await api.get('/quizzes');
    return res.data;
  },

  getQuizzesByCourse: async (courseId: string) => {
    const res = await api.get(`/quizzes/course/${courseId}`);
    return res.data;
  },

  getQuizById: async (id: string) => {
    const res = await api.get(`/quizzes/${id}`);
    return res.data;
  },

  submitQuiz: async (id: string, answers: Record<string, number>) => {
    const res = await api.post(`/quizzes/${id}/submit`, { answers });
    return res.data;
  },

  getMyResults: async () => {
    const res = await api.get('/quizzes/results/my');
    return res.data;
  },
};