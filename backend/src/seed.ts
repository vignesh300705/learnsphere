import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model';
import Course from './models/Course.model';
import Quiz from './models/Quiz.model';
import QuizResult from './models/QuizResult.model';
import LearningActivity from './models/LearningActivity.model';
import Recommendation from './models/Recommendation.model';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB connected');

    // ─── CLEAR ALL EXISTING DATA ───
    await User.deleteMany({});
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    await QuizResult.deleteMany({});
    await LearningActivity.deleteMany({});
    await Recommendation.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── CREATE USERS ───

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@learnsphere.com',
      password: 'password123',
      role: 'admin',
      enrolledCourses: [],
    });

    const instructor1 = await User.create({
      name: 'Dr. Sarah Miller',
      email: 'sarah@learnsphere.com',
      password: 'password123',
      role: 'instructor',
      enrolledCourses: [],
    });

    const instructor2 = await User.create({
      name: 'Prof. Robert Brown',
      email: 'robert@learnsphere.com',
      password: 'password123',
      role: 'instructor',
      enrolledCourses: [],
    });

    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@learnsphere.com',
      password: 'password123',
      role: 'student',
      enrolledCourses: [],
    });

    const student2 = await User.create({
      name: 'Maria Garcia',
      email: 'maria@learnsphere.com',
      password: 'password123',
      role: 'student',
      enrolledCourses: [],
    });

    const student3 = await User.create({
      name: 'James Wilson',
      email: 'james@learnsphere.com',
      password: 'password123',
      role: 'student',
      enrolledCourses: [],
    });

    const student4 = await User.create({
      name: 'Sophie Chen',
      email: 'sophie@learnsphere.com',
      password: 'password123',
      role: 'student',
      enrolledCourses: [],
    });

    const student5 = await User.create({
      name: 'David Kim',
      email: 'david@learnsphere.com',
      password: 'password123',
      role: 'student',
      enrolledCourses: [],
    });

    console.log('👤 Users created');

    // ─── CREATE COURSES ───
    const course1 = await Course.create({
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental data structures and algorithmic thinking with hands-on exercises.',
      instructorId: instructor1._id,
      instructorName: 'Dr. Sarah Miller',
      category: 'Computer Science',
      enrolledStudents: [student1._id, student2._id, student4._id, student5._id],
      videos: [
        { title: 'Introduction to Arrays', url: 'https://www.youtube.com/embed/QJNwK2uJyGs', duration: 45 },
        { title: 'Linked Lists Deep Dive', url: 'https://www.youtube.com/embed/njTh_OwMljA', duration: 60 },
        { title: 'Trees and Graphs', url: 'https://www.youtube.com/embed/oSWTXtMglKE', duration: 55 },
        { title: 'Sorting Algorithms', url: 'https://www.youtube.com/embed/kgBjXUE_Nwc', duration: 50 },
      ],
      materials: [
        { title: 'DSA Cheat Sheet', type: 'pdf', url: '#' },
        { title: 'Practice Problems', type: 'doc', url: '#' },
      ],
    });

    const course2 = await Course.create({
      title: 'Machine Learning Fundamentals',
      description: 'Learn the foundations of machine learning, from regression to neural networks.',
      instructorId: instructor1._id,
      instructorName: 'Dr. Sarah Miller',
      category: 'AI/ML',
      enrolledStudents: [student1._id, student3._id, student4._id],
      videos: [
        { title: 'What is Machine Learning?', url: 'https://www.youtube.com/embed/ukzFI9rgwfU', duration: 40 },
        { title: 'Linear Regression', url: 'https://www.youtube.com/embed/nk2CQITm_eo', duration: 55 },
        { title: 'Classification Models', url: 'https://www.youtube.com/embed/yIYKR4sgzI8', duration: 65 },
      ],
      materials: [
        { title: 'ML Notebook', type: 'link', url: '#' },
      ],
    });

    const course3 = await Course.create({
      title: 'Web Development Bootcamp',
      description: 'Full-stack web development from HTML to React and Node.js.',
      instructorId: instructor2._id,
      instructorName: 'Prof. Robert Brown',
      category: 'Web Development',
      enrolledStudents: [student1._id, student2._id, student3._id],
      videos: [
        { title: 'HTML & CSS Basics', url: 'https://www.youtube.com/embed/qz0aGYrrlhU', duration: 50 },
        { title: 'JavaScript Essentials', url: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: 70 },
        { title: 'React Fundamentals', url: 'https://www.youtube.com/embed/Ke90Tje7VS0', duration: 60 },
        { title: 'Node.js & Express', url: 'https://www.youtube.com/embed/Oe421EPjeBE', duration: 65 },
        { title: 'Database Integration', url: 'https://www.youtube.com/embed/ofme2o29ngU', duration: 45 },
      ],
      materials: [
        { title: 'Project Starter Files', type: 'doc', url: '#' },
        { title: 'API Reference Guide', type: 'pdf', url: '#' },
      ],
    });

    console.log('📚 Courses created');

    // ─── UPDATE ENROLLED COURSES IN USERS ───
    await User.findByIdAndUpdate(student1._id, {
      enrolledCourses: [course1._id, course2._id, course3._id]
    });
    await User.findByIdAndUpdate(student2._id, {
      enrolledCourses: [course1._id, course3._id]
    });
    await User.findByIdAndUpdate(student3._id, {
      enrolledCourses: [course2._id, course3._id]
    });
    await User.findByIdAndUpdate(student4._id, {
      enrolledCourses: [course1._id, course2._id]
    });
    await User.findByIdAndUpdate(student5._id, {
      enrolledCourses: [course1._id]
    });

    // ─── CREATE QUIZZES ───
    const quiz1 = await Quiz.create({
      courseId: course1._id,
      title: 'Arrays & Linked Lists Quiz',
      questions: [
        {
          question: 'What is the time complexity of accessing an element in an array by index?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 0,
        },
        {
          question: 'Which data structure uses LIFO principle?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correctAnswer: 1,
        },
        {
          question: 'What is the space complexity of a singly linked list with n elements?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 2,
        },
        {
          question: 'Which operation is O(1) for a linked list?',
          options: ['Search', 'Insert at head', 'Access by index', 'Sort'],
          correctAnswer: 1,
        },
        {
          question: 'What is a doubly linked list advantage over singly?',
          options: ['Less memory', 'Bidirectional traversal', 'Faster search', 'Simpler code'],
          correctAnswer: 1,
        },
      ],
    });

    const quiz2 = await Quiz.create({
      courseId: course1._id,
      title: 'Trees & Graphs Quiz',
      questions: [
        {
          question: 'What is the maximum number of children a binary tree node can have?',
          options: ['1', '2', '3', 'Unlimited'],
          correctAnswer: 1,
        },
        {
          question: 'Which traversal visits root first?',
          options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
          correctAnswer: 1,
        },
        {
          question: 'A graph with no cycles is called?',
          options: ['Tree', 'Complete graph', 'Bipartite graph', 'Multigraph'],
          correctAnswer: 0,
        },
      ],
    });

    const quiz3 = await Quiz.create({
      courseId: course2._id,
      title: 'ML Basics Quiz',
      questions: [
        {
          question: 'Which is a supervised learning algorithm?',
          options: ['K-means', 'Linear Regression', 'PCA', 'Autoencoder'],
          correctAnswer: 1,
        },
        {
          question: 'What does overfitting mean?',
          options: ['Model too simple', 'Model memorizes training data', 'Model underfits', 'Model is optimal'],
          correctAnswer: 1,
        },
        {
          question: 'What metric is used for classification?',
          options: ['MSE', 'R²', 'Accuracy', 'MAE'],
          correctAnswer: 2,
        },
      ],
    });

    const quiz4 = await Quiz.create({
      courseId: course3._id,
      title: 'JavaScript Fundamentals',
      questions: [
        {
          question: 'What does "===" check in JavaScript?',
          options: ['Value only', 'Type only', 'Value and type', 'Reference'],
          correctAnswer: 2,
        },
        {
          question: 'Which is NOT a JavaScript data type?',
          options: ['String', 'Boolean', 'Float', 'Symbol'],
          correctAnswer: 2,
        },
        {
          question: 'What is a closure?',
          options: ['A loop', 'Function with access to outer scope', 'An error handler', 'A module'],
          correctAnswer: 1,
        },
        {
          question: 'What does async/await handle?',
          options: ['Synchronous code', 'Promises', 'Errors only', 'DOM manipulation'],
          correctAnswer: 1,
        },
      ],
    });

    console.log('📝 Quizzes created');

    // ─── CREATE QUIZ RESULTS ───
    await QuizResult.create([
      { studentId: student1._id, quizId: quiz1._id, courseId: course1._id, score: 4, totalQuestions: 5 },
      { studentId: student1._id, quizId: quiz2._id, courseId: course1._id, score: 2, totalQuestions: 3 },
      { studentId: student1._id, quizId: quiz3._id, courseId: course2._id, score: 3, totalQuestions: 3 },
      { studentId: student2._id, quizId: quiz1._id, courseId: course1._id, score: 3, totalQuestions: 5 },
      { studentId: student2._id, quizId: quiz4._id, courseId: course3._id, score: 2, totalQuestions: 4 },
      { studentId: student3._id, quizId: quiz3._id, courseId: course2._id, score: 1, totalQuestions: 3 },
      { studentId: student3._id, quizId: quiz4._id, courseId: course3._id, score: 3, totalQuestions: 4 },
      { studentId: student4._id, quizId: quiz1._id, courseId: course1._id, score: 5, totalQuestions: 5 },
      { studentId: student4._id, quizId: quiz3._id, courseId: course2._id, score: 2, totalQuestions: 3 },
      { studentId: student5._id, quizId: quiz1._id, courseId: course1._id, score: 1, totalQuestions: 5 },
    ]);

    console.log('📊 Quiz results created');

    // ─── CREATE LEARNING ACTIVITIES ───
    const c1 = course1.toObject() as any;
    const c2 = course2.toObject() as any;
    const c3 = course3.toObject() as any;

    await LearningActivity.create([
      // Alex - course1
      {
        studentId: student1._id, courseId: course1._id,
        videoProgress: new Map([
          [c1.videos[0]._id.toString(), 100],
          [c1.videos[1]._id.toString(), 85],
          [c1.videos[2]._id.toString(), 60],
          [c1.videos[3]._id.toString(), 30],
        ]),
        quizScores: [80, 67], timeSpent: 420,
        lastActive: new Date('2026-03-10'),
        completionPercentage: 72,
      },
      // Alex - course2
      {
        studentId: student1._id, courseId: course2._id,
        videoProgress: new Map([
          [c2.videos[0]._id.toString(), 100],
          [c2.videos[1]._id.toString(), 90],
          [c2.videos[2]._id.toString(), 45],
        ]),
        quizScores: [100], timeSpent: 280,
        lastActive: new Date('2026-03-09'),
        completionPercentage: 65,
      },
      // Alex - course3
      {
        studentId: student1._id, courseId: course3._id,
        videoProgress: new Map([
          [c3.videos[0]._id.toString(), 100],
          [c3.videos[1]._id.toString(), 70],
          [c3.videos[2]._id.toString(), 20],
          [c3.videos[3]._id.toString(), 0],
          [c3.videos[4]._id.toString(), 0],
        ]),
        quizScores: [], timeSpent: 180,
        lastActive: new Date('2026-03-08'),
        completionPercentage: 35,
      },
      // Maria - course1
      {
        studentId: student2._id, courseId: course1._id,
        videoProgress: new Map([
          [c1.videos[0]._id.toString(), 100],
          [c1.videos[1]._id.toString(), 50],
          [c1.videos[2]._id.toString(), 10],
          [c1.videos[3]._id.toString(), 0],
        ]),
        quizScores: [60], timeSpent: 200,
        lastActive: new Date('2026-03-07'),
        completionPercentage: 40,
      },
      // Maria - course3
      {
        studentId: student2._id, courseId: course3._id,
        videoProgress: new Map([
          [c3.videos[0]._id.toString(), 80],
          [c3.videos[1]._id.toString(), 30],
          [c3.videos[2]._id.toString(), 0],
          [c3.videos[3]._id.toString(), 0],
          [c3.videos[4]._id.toString(), 0],
        ]),
        quizScores: [50], timeSpent: 120,
        lastActive: new Date('2026-03-05'),
        completionPercentage: 22,
      },
      // James - course2
      {
        studentId: student3._id, courseId: course2._id,
        videoProgress: new Map([
          [c2.videos[0]._id.toString(), 60],
          [c2.videos[1]._id.toString(), 20],
          [c2.videos[2]._id.toString(), 0],
        ]),
        quizScores: [33], timeSpent: 90,
        lastActive: new Date('2026-03-03'),
        completionPercentage: 18,
      },
      // James - course3
      {
        studentId: student3._id, courseId: course3._id,
        videoProgress: new Map([
          [c3.videos[0]._id.toString(), 100],
          [c3.videos[1]._id.toString(), 100],
          [c3.videos[2]._id.toString(), 80],
          [c3.videos[3]._id.toString(), 50],
          [c3.videos[4]._id.toString(), 10],
        ]),
        quizScores: [75], timeSpent: 350,
        lastActive: new Date('2026-03-10'),
        completionPercentage: 68,
      },
      // Sophie - course1
      {
        studentId: student4._id, courseId: course1._id,
        videoProgress: new Map([
          [c1.videos[0]._id.toString(), 100],
          [c1.videos[1]._id.toString(), 100],
          [c1.videos[2]._id.toString(), 95],
          [c1.videos[3]._id.toString(), 80],
        ]),
        quizScores: [100], timeSpent: 500,
        lastActive: new Date('2026-03-11'),
        completionPercentage: 90,
      },
      // Sophie - course2
      {
        studentId: student4._id, courseId: course2._id,
        videoProgress: new Map([
          [c2.videos[0]._id.toString(), 100],
          [c2.videos[1]._id.toString(), 70],
          [c2.videos[2]._id.toString(), 30],
        ]),
        quizScores: [67], timeSpent: 210,
        lastActive: new Date('2026-03-10'),
        completionPercentage: 55,
      },
      // David - course1 (at risk)
      {
        studentId: student5._id, courseId: course1._id,
        videoProgress: new Map([
          [c1.videos[0]._id.toString(), 40],
          [c1.videos[1]._id.toString(), 0],
          [c1.videos[2]._id.toString(), 0],
          [c1.videos[3]._id.toString(), 0],
        ]),
        quizScores: [20], timeSpent: 45,
        lastActive: new Date('2026-02-20'),
        completionPercentage: 8,
      },
    ]);

    console.log('📈 Learning activities created');

    // ─── CREATE RECOMMENDATIONS ───
    await Recommendation.create([
      {
        studentId: student1._id,
        type: 'review',
        title: 'Review Trees & Graphs',
        description: 'Your score in this topic is below average. Revisit the lecture and practice problems.',
        priority: 'high',
        relatedCourse: course1._id,
      },
      {
        studentId: student1._id,
        type: 'practice',
        title: 'Practice Sorting Algorithms',
        description: 'Complete 5 additional sorting exercises to strengthen your understanding.',
        priority: 'medium',
        relatedCourse: course1._id,
      },
      {
        studentId: student1._id,
        type: 'video',
        title: 'Watch JavaScript Deep Dive',
        description: 'Your JS fundamentals need reinforcement. Watch the supplementary video.',
        priority: 'medium',
        relatedCourse: course3._id,
      },
      {
        studentId: student1._id,
        type: 'resource',
        title: 'ML Study Guide',
        description: 'Download the comprehensive ML study guide for exam preparation.',
        priority: 'low',
        relatedCourse: course2._id,
      },
      {
        studentId: student5._id,
        type: 'review',
        title: 'Catch Up on Arrays',
        description: 'You are falling behind. Please revisit the Arrays lecture immediately.',
        priority: 'high',
        relatedCourse: course1._id,
      },
      {
        studentId: student5._id,
        type: 'practice',
        title: 'Daily Practice Problems',
        description: 'Solve at least 2 problems daily to improve your understanding.',
        priority: 'high',
        relatedCourse: course1._id,
      },
    ]);

    console.log('💡 Recommendations created');

    // ─── PRINT LOGIN CREDENTIALS ───
    console.log('\n═══════════════════════════════════════');
    console.log('✅ SEED COMPLETE — LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('🔑 All accounts use password: password123');
    console.log('');
    console.log('👑 Admin:');
    console.log('   admin@learnsphere.com');
    console.log('');
    console.log('👨‍🏫 Instructors:');
    console.log('   sarah@learnsphere.com');
    console.log('   robert@learnsphere.com');
    console.log('');
    console.log('👨‍🎓 Students:');
    console.log('   alex@learnsphere.com    → good progress');
    console.log('   maria@learnsphere.com   → medium risk');
    console.log('   james@learnsphere.com   → medium risk');
    console.log('   sophie@learnsphere.com  → top student 🏆');
    console.log('   david@learnsphere.com   → at risk ⚠️');
    console.log('═══════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();