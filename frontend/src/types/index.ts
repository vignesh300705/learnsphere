export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  enrolledCourses: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  thumbnail?: string;
  videos: Video[];
  materials: Material[];
  enrolledStudents: string[];
  category: string;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: number; // minutes
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link';
  url: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  id: string;
  studentId: string;
  quizId: string;
  courseId: string;
  score: number;
  totalQuestions: number;
  attemptDate: string;
}

export interface LearningActivity {
  studentId: string;
  courseId: string;
  videoProgress: Record<string, number>; // videoId -> percentage
  quizScores: number[];
  timeSpent: number; // minutes
  lastActive: string;
  completionPercentage: number;
}

export interface StudentAnalytics {
  studentId: string;
  totalTimeSpent: number;
  averageQuizScore: number;
  coursesCompleted: number;
  coursesInProgress: number;
  loginFrequency: number; // per week
  riskLevel: 'low' | 'medium' | 'high';
  weeklyProgress: { week: string; hours: number; score: number }[];
  topicPerformance: { topic: string; score: number }[];
}

export interface CourseAnalytics {
  courseId: string;
  averageScore: number;
  completionRate: number;
  totalStudents: number;
  activeStudents: number;
  engagementScore: number;
  difficultTopics: { topic: string; avgScore: number }[];
  studentPerformance: { name: string; score: number; progress: number; risk: string }[];
}

export interface Recommendation {
  id: string;
  type: 'review' | 'practice' | 'video' | 'resource';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  relatedCourse?: string;
}
