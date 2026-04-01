import { Router } from 'express';
import {
  getAllCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  enrollCourse,
} from '../controllers/course.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/',        protect, getAllCourses);
router.get('/my',      protect, getMyCourses);
router.get('/:id',     protect, getCourseById);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);

export default router;