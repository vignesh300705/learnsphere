import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import LearningActivity from '../models/LearningActivity.model';
import QuizResult from '../models/QuizResult.model';
import User from '../models/User.model';
import Course from '../models/Course.model';
import Recommendation from '../models/Recommendation.model';

// Helper: predict risk level
const predictRisk = (activity: any): 'low' | 'medium' | 'high' => {
  const avgQuiz = activity.quizScores?.length
    ? activity.quizScores.reduce((a: number, b: number) => a + b, 0) / activity.quizScores.length
    : 0;
  const daysSince = Math.floor(
    (Date.now() - new Date(activity.lastActive).getTime()) / (1000 * 60 * 60 * 24)
  );
  let risk = 0;
  if (avgQuiz < 40) risk += 3;
  else if (avgQuiz < 60) risk += 2;
  else if (avgQuiz < 75) risk += 1;
  if (activity.completionPercentage < 20) risk += 3;
  else if (activity.completionPercentage < 50) risk += 1;
  if (daysSince > 14) risk += 3;
  else if (daysSince > 7) risk += 2;
  if (activity.timeSpent < 60) risk += 2;
  if (risk >= 6) return 'high';
  if (risk >= 3) return 'medium';
  return 'low';
};

// GET /api/analytics/student — student's own analytics
export const getStudentAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const activities = await LearningActivity.find({ studentId: req.userId })
      .populate('courseId', 'title');
    const results = await QuizResult.find({ studentId: req.userId })
      .populate('quizId', 'title')
      .populate('courseId', 'title');

    const totalTimeSpent = activities.reduce((s, a) => s + a.timeSpent, 0);
    const avgQuizScore = results.length
      ? Math.round(results.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / results.length)
      : 0;

    const courseTime = activities.map((a: any) => ({
      course: a.courseId?.title?.slice(0, 15) || 'Unknown',
      hours: Math.round((a.timeSpent / 60) * 10) / 10,
      completion: a.completionPercentage,
    }));

    const quizHistory = results.map((r: any) => ({
      quiz: r.quizId?.title?.slice(0, 15) || 'Quiz',
      score: Math.round((r.score / r.totalQuestions) * 100),
    }));

    const riskLevel = activities.length
      ? activities.reduce((worst: string, a) => {
          const r = predictRisk(a);
          if (r === 'high') return 'high';
          if (r === 'medium' && worst !== 'high') return 'medium';
          return worst;
        }, 'low')
      : 'low';

    res.json({
      totalTimeSpent,
      totalHours: Math.round(totalTimeSpent / 60),
      avgQuizScore,
      coursesCount: activities.length,
      quizzesTaken: results.length,
      courseTime,
      quizHistory,
      riskLevel,
      activities,
      results,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/instructor — instructor's course analytics
export const getInstructorAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find({ instructorId: req.userId });
    const courseIds = courses.map(c => c._id);

    const activities = await LearningActivity.find({ courseId: { $in: courseIds } })
      .populate('studentId', 'name email')
      .populate('courseId', 'title');

    const courseStats = courses.map((c: any) => {
      const acts = activities.filter(a => a.courseId._id.toString() === c._id.toString());
      const avgCompletion = acts.length
        ? Math.round(acts.reduce((s, a) => s + a.completionPercentage, 0) / acts.length)
        : 0;
      return {
        name: c.title.slice(0, 20),
        completion: avgCompletion,
        students: c.enrolledStudents.length,
      };
    });

    // Student risks
    const studentMap = new Map();
    activities.forEach((a: any) => {
      const sid = a.studentId._id.toString();
      const risk = predictRisk(a);
      const current = studentMap.get(sid);
      if (!current || risk === 'high' || (risk === 'medium' && current.risk === 'low')) {
        studentMap.set(sid, { name: a.studentId.name, risk });
      }
    });

    const studentRisks = Array.from(studentMap.values())
      .sort((a, b) => {
        const order: any = { high: 0, medium: 1, low: 2 };
        return order[a.risk] - order[b.risk];
      });

    const highRiskCount = studentRisks.filter(s => s.risk === 'high').length;
    const avgCompletion = courseStats.length
      ? Math.round(courseStats.reduce((s, c) => s + c.completion, 0) / courseStats.length)
      : 0;

    res.json({
      totalCourses: courses.length,
      totalStudents: studentMap.size,
      highRiskCount,
      avgCompletion,
      courseStats,
      studentRisks,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/leaderboard
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const students = await User.find({ role: 'student' });

    const leaderboard = await Promise.all(students.map(async (s) => {
      const results = await QuizResult.find({ studentId: s._id });
      const activities = await LearningActivity.find({ studentId: s._id });

      const avgScore = results.length
        ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / results.length)
        : 0;
      const totalTime = activities.reduce((sum, a) => sum + a.timeSpent, 0);
      const avgCompletion = activities.length
        ? Math.round(activities.reduce((sum, a) => sum + a.completionPercentage, 0) / activities.length)
        : 0;
      const points = Math.round(avgScore * 0.5 + avgCompletion * 0.3 + Math.min(totalTime / 10, 20));

      return {
        id: s._id,
        name: s.name,
        email: s.email,
        avgScore,
        totalTime,
        avgCompletion,
        points,
      };
    }));

    leaderboard.sort((a, b) => b.points - a.points);
    res.json(leaderboard);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/students — admin/instructor sees all students
export const getAllStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const studentsWithRisk = await Promise.all(students.map(async (s) => {
      const activities = await LearningActivity.find({ studentId: s._id });
      const worstRisk = activities.reduce((worst: string, a) => {
        const r = predictRisk(a);
        if (r === 'high') return 'high';
        if (r === 'medium' && worst !== 'high') return 'medium';
        return worst;
      }, 'low');
      return {
        id: s._id,
        name: s.name,
        email: s.email,
        enrolledCourses: s.enrolledCourses.length,
        risk: worstRisk,
        createdAt: s.createdAt,
      };
    }));
    res.json(studentsWithRisk);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/recommendations
export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const recommendations = await Recommendation.find({ studentId: req.userId })
      .populate('relatedCourse', 'title');
    res.json(recommendations);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/analytics/admin
export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const students = await User.countDocuments({ role: 'student' });
    const instructors = await User.countDocuments({ role: 'instructor' });
    const courses = await Course.countDocuments();
    const allUsers = await User.find().select('-password');

    const courseEnrollment = await Course.find().select('title enrolledStudents');
    const courseEnrollmentData = courseEnrollment.map(c => ({
      name: c.title.slice(0, 15),
      enrolled: c.enrolledStudents.length,
    }));

    res.json({
      students,
      instructors,
      courses,
      allUsers,
      courseEnrollmentData,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};