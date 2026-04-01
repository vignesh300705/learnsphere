import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Quiz from '../models/Quiz.model';
import QuizResult from '../models/QuizResult.model';

// GET /api/quizzes — get all quizzes for enrolled courses
export const getQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await Quiz.find().populate('courseId', 'title');
    res.json(quizzes);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/quizzes/course/:courseId
export const getQuizzesByCourse = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId });
    res.json(quizzes);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/quizzes/:id
export const getQuizById = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/quizzes — instructor creates quiz
export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, title, questions } = req.body;
    const quiz = await Quiz.create({ courseId, title, questions });
    res.status(201).json(quiz);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/quizzes/:id/submit — student submits quiz
export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body; // { questionId: selectedIndex }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Check if already attempted
    const existing = await QuizResult.findOne({
      studentId: req.userId,
      quizId: quiz._id,
    });
    if (existing)
      return res.status(400).json({ message: 'Quiz already attempted' });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q: any) => {
      const qId = q._id.toString();
      if (answers[qId] === q.correctAnswer) score++;
    });

    const result = await QuizResult.create({
      studentId:      req.userId,
      quizId:         quiz._id,
      courseId:       quiz.courseId,
      score,
      totalQuestions: quiz.questions.length,
      answers,
    });

    res.status(201).json({
      score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      result,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/quizzes/results/my — student's own results
export const getMyResults = async (req: AuthRequest, res: Response) => {
  try {
    const results = await QuizResult.find({ studentId: req.userId })
      .populate('quizId', 'title')
      .populate('courseId', 'title');
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};