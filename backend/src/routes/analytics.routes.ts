import { Router } from 'express';
import {
  getStudentAnalytics,
  getInstructorAnalytics,
  getLeaderboard,
  getAllStudents,
  getRecommendations,
  getAdminAnalytics,
} from '../controllers/analytics.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/student',      protect, authorize('student'), getStudentAnalytics);
router.get('/instructor',   protect, authorize('instructor'), getInstructorAnalytics);
router.get('/leaderboard',  protect, getLeaderboard);
router.get('/students',     protect, authorize('instructor', 'admin'), getAllStudents);
router.get('/recommendations', protect, authorize('student'), getRecommendations);
router.get('/admin',        protect, authorize('admin'), getAdminAnalytics);

export default router;