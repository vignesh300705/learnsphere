import api from '@/lib/api';

export const courseService = {
  // Get all courses (admin) or filtered by role
  getMyCourses: async () => {
    const res = await api.get('/courses/my');
    return res.data;
  },

  getAllCourses: async () => {
    const res = await api.get('/courses');
    return res.data;
  },

  getCourseById: async (id: string) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  createCourse: async (data: any) => {
    const res = await api.post('/courses', data);
    return res.data;
  },

  enrollCourse: async (id: string) => {
    const res = await api.post(`/courses/${id}/enroll`);
    return res.data;
  },
};