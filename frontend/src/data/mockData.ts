import { User, Course, Quiz, QuizResult, LearningActivity, StudentAnalytics, CourseAnalytics, Recommendation } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  { id: 'student-1', name: 'Alex Johnson', email: 'alex@student.com', role: 'student', enrolledCourses: ['course-1', 'course-2', 'course-3'], createdAt: '2025-09-01' },
  { id: 'student-2', name: 'Maria Garcia', email: 'maria@student.com', role: 'student', enrolledCourses: ['course-1', 'course-3'], createdAt: '2025-09-15' },
  { id: 'student-3', name: 'James Wilson', email: 'james@student.com', role: 'student', enrolledCourses: ['course-2', 'course-3'], createdAt: '2025-10-01' },
  { id: 'student-4', name: 'Sophie Chen', email: 'sophie@student.com', role: 'student', enrolledCourses: ['course-1', 'course-2'], createdAt: '2025-10-10' },
  { id: 'student-5', name: 'David Kim', email: 'david@student.com', role: 'student', enrolledCourses: ['course-1'], createdAt: '2025-11-01' },
  { id: 'instructor-1', name: 'Dr. Sarah Miller', email: 'sarah@instructor.com', role: 'instructor', enrolledCourses: [], createdAt: '2025-01-01' },
  { id: 'instructor-2', name: 'Prof. Robert Brown', email: 'robert@instructor.com', role: 'instructor', enrolledCourses: [], createdAt: '2025-01-01' },
  { id: 'admin-1', name: 'System Admin', email: 'admin@platform.com', role: 'admin', enrolledCourses: [], createdAt: '2025-01-01' },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1', title: 'Data Structures & Algorithms', description: 'Master fundamental data structures and algorithmic thinking with hands-on exercises.',
    instructorId: 'instructor-1', instructorName: 'Dr. Sarah Miller', category: 'Computer Science',
    videos: [
      { id: 'v1', title: 'Introduction to Arrays', url: '#', duration: 45 },
      { id: 'v2', title: 'Linked Lists Deep Dive', url: '#', duration: 60 },
      { id: 'v3', title: 'Trees and Graphs', url: '#', duration: 55 },
      { id: 'v4', title: 'Sorting Algorithms', url: '#', duration: 50 },
    ],
    materials: [{ id: 'm1', title: 'DSA Cheat Sheet', type: 'pdf', url: '#' }],
    enrolledStudents: ['student-1', 'student-2', 'student-4', 'student-5'],
    createdAt: '2025-08-01',
  },
  {
    id: 'course-2', title: 'Machine Learning Fundamentals', description: 'Learn the foundations of machine learning, from regression to neural networks.',
    instructorId: 'instructor-1', instructorName: 'Dr. Sarah Miller', category: 'AI/ML',
    videos: [
      { id: 'v5', title: 'What is Machine Learning?', url: '#', duration: 40 },
      { id: 'v6', title: 'Linear Regression', url: '#', duration: 55 },
      { id: 'v7', title: 'Classification Models', url: '#', duration: 65 },
    ],
    materials: [{ id: 'm2', title: 'ML Notebook', type: 'link', url: '#' }],
    enrolledStudents: ['student-1', 'student-3', 'student-4'],
    createdAt: '2025-08-15',
  },
  {
    id: 'course-3', title: 'Web Development Bootcamp', description: 'Full-stack web development from HTML to React and Node.js.',
    instructorId: 'instructor-2', instructorName: 'Prof. Robert Brown', category: 'Web Development',
    videos: [
      { id: 'v8', title: 'HTML & CSS Basics', url: '#', duration: 50 },
      { id: 'v9', title: 'JavaScript Essentials', url: '#', duration: 70 },
      { id: 'v10', title: 'React Fundamentals', url: '#', duration: 60 },
      { id: 'v11', title: 'Node.js & Express', url: '#', duration: 65 },
      { id: 'v12', title: 'Database Integration', url: '#', duration: 45 },
    ],
    materials: [
      { id: 'm3', title: 'Project Starter Files', type: 'doc', url: '#' },
      { id: 'm4', title: 'API Reference Guide', type: 'pdf', url: '#' },
    ],
    enrolledStudents: ['student-1', 'student-2', 'student-3'],
    createdAt: '2025-09-01',
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1', courseId: 'course-1', title: 'Arrays & Linked Lists Quiz', createdAt: '2025-09-10',
    questions: [
      { id: 'q1', question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0 },
      { id: 'q2', question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: 1 },
      { id: 'q3', question: 'What is the space complexity of a singly linked list with n elements?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2 },
      { id: 'q4', question: 'Which operation is O(1) for a linked list?', options: ['Search', 'Insert at head', 'Access by index', 'Sort'], correctAnswer: 1 },
      { id: 'q5', question: 'What is a doubly linked list advantage over singly?', options: ['Less memory', 'Bidirectional traversal', 'Faster search', 'Simpler code'], correctAnswer: 1 },
    ],
  },
  {
    id: 'quiz-2', courseId: 'course-1', title: 'Trees & Graphs Quiz', createdAt: '2025-10-01',
    questions: [
      { id: 'q6', question: 'What is the maximum number of children a binary tree node can have?', options: ['1', '2', '3', 'Unlimited'], correctAnswer: 1 },
      { id: 'q7', question: 'Which traversal visits root first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'], correctAnswer: 1 },
      { id: 'q8', question: 'A graph with no cycles is called?', options: ['Tree', 'Complete graph', 'Bipartite graph', 'Multigraph'], correctAnswer: 0 },
    ],
  },
  {
    id: 'quiz-3', courseId: 'course-2', title: 'ML Basics Quiz', createdAt: '2025-09-20',
    questions: [
      { id: 'q9', question: 'Which is a supervised learning algorithm?', options: ['K-means', 'Linear Regression', 'PCA', 'Autoencoder'], correctAnswer: 1 },
      { id: 'q10', question: 'What does overfitting mean?', options: ['Model too simple', 'Model memorizes training data', 'Model underfits', 'Model is optimal'], correctAnswer: 1 },
      { id: 'q11', question: 'What metric is used for classification?', options: ['MSE', 'R²', 'Accuracy', 'MAE'], correctAnswer: 2 },
    ],
  },
  {
    id: 'quiz-4', courseId: 'course-3', title: 'JavaScript Fundamentals', createdAt: '2025-10-05',
    questions: [
      { id: 'q12', question: 'What does "===" check in JavaScript?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], correctAnswer: 2 },
      { id: 'q13', question: 'Which is NOT a JavaScript data type?', options: ['String', 'Boolean', 'Float', 'Symbol'], correctAnswer: 2 },
      { id: 'q14', question: 'What is a closure?', options: ['A loop', 'Function with access to outer scope', 'An error handler', 'A module'], correctAnswer: 1 },
      { id: 'q15', question: 'What does async/await handle?', options: ['Synchronous code', 'Promises', 'Errors only', 'DOM manipulation'], correctAnswer: 1 },
    ],
  },
];

export const mockQuizResults: QuizResult[] = [
  { id: 'qr1', studentId: 'student-1', quizId: 'quiz-1', courseId: 'course-1', score: 4, totalQuestions: 5, attemptDate: '2025-09-15' },
  { id: 'qr2', studentId: 'student-1', quizId: 'quiz-2', courseId: 'course-1', score: 2, totalQuestions: 3, attemptDate: '2025-10-05' },
  { id: 'qr3', studentId: 'student-1', quizId: 'quiz-3', courseId: 'course-2', score: 3, totalQuestions: 3, attemptDate: '2025-10-01' },
  { id: 'qr4', studentId: 'student-2', quizId: 'quiz-1', courseId: 'course-1', score: 3, totalQuestions: 5, attemptDate: '2025-09-18' },
  { id: 'qr5', studentId: 'student-2', quizId: 'quiz-4', courseId: 'course-3', score: 2, totalQuestions: 4, attemptDate: '2025-10-10' },
  { id: 'qr6', studentId: 'student-3', quizId: 'quiz-3', courseId: 'course-2', score: 1, totalQuestions: 3, attemptDate: '2025-10-02' },
  { id: 'qr7', studentId: 'student-3', quizId: 'quiz-4', courseId: 'course-3', score: 3, totalQuestions: 4, attemptDate: '2025-10-12' },
  { id: 'qr8', studentId: 'student-4', quizId: 'quiz-1', courseId: 'course-1', score: 5, totalQuestions: 5, attemptDate: '2025-09-16' },
  { id: 'qr9', studentId: 'student-4', quizId: 'quiz-3', courseId: 'course-2', score: 2, totalQuestions: 3, attemptDate: '2025-10-03' },
  { id: 'qr10', studentId: 'student-5', quizId: 'quiz-1', courseId: 'course-1', score: 1, totalQuestions: 5, attemptDate: '2025-09-20' },
];

export const mockActivities: LearningActivity[] = [
  { studentId: 'student-1', courseId: 'course-1', videoProgress: { v1: 100, v2: 85, v3: 60, v4: 30 }, quizScores: [80, 67], timeSpent: 420, lastActive: '2026-03-10', completionPercentage: 72 },
  { studentId: 'student-1', courseId: 'course-2', videoProgress: { v5: 100, v6: 90, v7: 45 }, quizScores: [100], timeSpent: 280, lastActive: '2026-03-09', completionPercentage: 65 },
  { studentId: 'student-1', courseId: 'course-3', videoProgress: { v8: 100, v9: 70, v10: 20, v11: 0, v12: 0 }, quizScores: [], timeSpent: 180, lastActive: '2026-03-08', completionPercentage: 35 },
  { studentId: 'student-2', courseId: 'course-1', videoProgress: { v1: 100, v2: 50, v3: 10, v4: 0 }, quizScores: [60], timeSpent: 200, lastActive: '2026-03-07', completionPercentage: 40 },
  { studentId: 'student-2', courseId: 'course-3', videoProgress: { v8: 80, v9: 30, v10: 0, v11: 0, v12: 0 }, quizScores: [50], timeSpent: 120, lastActive: '2026-03-05', completionPercentage: 22 },
  { studentId: 'student-3', courseId: 'course-2', videoProgress: { v5: 60, v6: 20, v7: 0 }, quizScores: [33], timeSpent: 90, lastActive: '2026-03-03', completionPercentage: 18 },
  { studentId: 'student-3', courseId: 'course-3', videoProgress: { v8: 100, v9: 100, v10: 80, v11: 50, v12: 10 }, quizScores: [75], timeSpent: 350, lastActive: '2026-03-10', completionPercentage: 68 },
  { studentId: 'student-4', courseId: 'course-1', videoProgress: { v1: 100, v2: 100, v3: 95, v4: 80 }, quizScores: [100], timeSpent: 500, lastActive: '2026-03-11', completionPercentage: 90 },
  { studentId: 'student-4', courseId: 'course-2', videoProgress: { v5: 100, v6: 70, v7: 30 }, quizScores: [67], timeSpent: 210, lastActive: '2026-03-10', completionPercentage: 55 },
  { studentId: 'student-5', courseId: 'course-1', videoProgress: { v1: 40, v2: 0, v3: 0, v4: 0 }, quizScores: [20], timeSpent: 45, lastActive: '2026-02-20', completionPercentage: 8 },
];

export const mockStudentAnalytics: Record<string, StudentAnalytics> = {
  'student-1': {
    studentId: 'student-1', totalTimeSpent: 880, averageQuizScore: 82, coursesCompleted: 0, coursesInProgress: 3, loginFrequency: 5, riskLevel: 'low',
    weeklyProgress: [
      { week: 'W1', hours: 8, score: 75 }, { week: 'W2', hours: 10, score: 78 }, { week: 'W3', hours: 12, score: 82 },
      { week: 'W4', hours: 9, score: 80 }, { week: 'W5', hours: 14, score: 85 }, { week: 'W6', hours: 11, score: 88 },
    ],
    topicPerformance: [
      { topic: 'Arrays', score: 92 }, { topic: 'Linked Lists', score: 85 }, { topic: 'Trees', score: 67 },
      { topic: 'ML Basics', score: 100 }, { topic: 'HTML/CSS', score: 90 }, { topic: 'JavaScript', score: 70 },
    ],
  },
  'student-5': {
    studentId: 'student-5', totalTimeSpent: 45, averageQuizScore: 20, coursesCompleted: 0, coursesInProgress: 1, loginFrequency: 0.5, riskLevel: 'high',
    weeklyProgress: [
      { week: 'W1', hours: 3, score: 20 }, { week: 'W2', hours: 2, score: 20 }, { week: 'W3', hours: 1, score: 20 },
      { week: 'W4', hours: 0, score: 0 }, { week: 'W5', hours: 0, score: 0 }, { week: 'W6', hours: 0, score: 0 },
    ],
    topicPerformance: [{ topic: 'Arrays', score: 20 }],
  },
};

export const mockCourseAnalytics: Record<string, CourseAnalytics> = {
  'course-1': {
    courseId: 'course-1', averageScore: 65, completionRate: 52, totalStudents: 4, activeStudents: 3, engagementScore: 72,
    difficultTopics: [
      { topic: 'Trees & Graphs', avgScore: 55 }, { topic: 'Sorting Algorithms', avgScore: 62 },
      { topic: 'Linked Lists', avgScore: 70 }, { topic: 'Arrays', avgScore: 85 },
    ],
    studentPerformance: [
      { name: 'Sophie Chen', score: 100, progress: 90, risk: 'low' },
      { name: 'Alex Johnson', score: 74, progress: 72, risk: 'low' },
      { name: 'Maria Garcia', score: 60, progress: 40, risk: 'medium' },
      { name: 'David Kim', score: 20, progress: 8, risk: 'high' },
    ],
  },
};

export const mockRecommendations: Recommendation[] = [
  { id: 'rec1', type: 'review', title: 'Review Trees & Graphs', description: 'Your score in this topic is below average. Revisit the lecture and practice problems.', priority: 'high', relatedCourse: 'course-1' },
  { id: 'rec2', type: 'practice', title: 'Practice Sorting Algorithms', description: 'Complete 5 additional sorting exercises to strengthen your understanding.', priority: 'medium', relatedCourse: 'course-1' },
  { id: 'rec3', type: 'video', title: 'Watch JavaScript Deep Dive', description: 'Your JS fundamentals need reinforcement. Watch the supplementary video.', priority: 'medium', relatedCourse: 'course-3' },
  { id: 'rec4', type: 'resource', title: 'ML Study Guide', description: 'Download the comprehensive ML study guide for exam preparation.', priority: 'low', relatedCourse: 'course-2' },
];

// Prediction helper
export function predictRiskLevel(activity: LearningActivity): 'low' | 'medium' | 'high' {
  const avgQuiz = activity.quizScores.length > 0 ? activity.quizScores.reduce((a, b) => a + b, 0) / activity.quizScores.length : 0;
  const daysSinceActive = Math.floor((Date.now() - new Date(activity.lastActive).getTime()) / (1000 * 60 * 60 * 24));
  
  let riskScore = 0;
  if (avgQuiz < 40) riskScore += 3;
  else if (avgQuiz < 60) riskScore += 2;
  else if (avgQuiz < 75) riskScore += 1;
  
  if (activity.completionPercentage < 20) riskScore += 3;
  else if (activity.completionPercentage < 50) riskScore += 1;
  
  if (daysSinceActive > 14) riskScore += 3;
  else if (daysSinceActive > 7) riskScore += 2;
  
  if (activity.timeSpent < 60) riskScore += 2;
  
  if (riskScore >= 6) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}
