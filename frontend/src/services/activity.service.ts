import api from '@/lib/api';

export const activityService = {
  getCourseActivity: async (courseId: string) => {
    const res = await api.get(`/activity/${courseId}`);
    return res.data;
  },

  updateVideoProgress: async (
    courseId: string,
    videoId: string,
    progress: number,
    timeSpent: number
  ) => {
    const res = await api.post('/activity/watch', {
      courseId,
      videoId,
      progress,
      timeSpent,
    });
    return res.data;
  },
};