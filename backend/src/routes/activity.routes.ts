import { Router } from 'express';
import { getCourseActivity, updateVideoProgress } from '../controllers/activity.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/:courseId',  protect, getCourseActivity);
router.post('/watch',     protect, updateVideoProgress);

export default router;