import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import LearningActivity from '../models/LearningActivity.model';

// GET /api/activity/:courseId — get student's activity for a course
export const getCourseActivity = async (req: AuthRequest, res: Response) => {
  try {
    const activity = await LearningActivity.findOne({
      studentId: req.userId,
      courseId: req.params.courseId,
    });
    res.json(activity || null);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/activity/watch — update video progress
export const updateVideoProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, videoId, progress, timeSpent } = req.body;

    let activity = await LearningActivity.findOne({
      studentId: req.userId,
      courseId,
    });

    if (!activity) {
      // Create new activity record
      activity = await LearningActivity.create({
        studentId: req.userId,
        courseId,
        videoProgress: { [videoId]: progress },
        quizScores: [],
        timeSpent: timeSpent || 0,
        lastActive: new Date(),
        completionPercentage: progress,
      });
    } else {
      // Update existing activity
      activity.videoProgress.set(videoId, progress);
      activity.timeSpent += timeSpent || 0;
      activity.lastActive = new Date();

      // Calculate overall completion
      const allProgress = Array.from(activity.videoProgress.values());
      activity.completionPercentage = Math.round(
        allProgress.reduce((a, b) => a + b, 0) / allProgress.length
      );

      await activity.save();
    }

    res.json(activity);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};