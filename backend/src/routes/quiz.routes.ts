import { Router } from 'express';
import {
  getQuizzes,
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  submitQuiz,
  getMyResults,
} from '../controllers/quiz.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/',                    protect, getQuizzes);
router.get('/results/my',          protect, getMyResults);
router.get('/course/:courseId',    protect, getQuizzesByCourse);
router.get('/:id',                 protect, getQuizById);
router.post('/',                   protect, authorize('instructor', 'admin'), createQuiz);
router.post('/:id/submit',         protect, authorize('student'), submitQuiz);

export default router;