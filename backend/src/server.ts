import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import quizRoutes from './routes/quiz.routes';
import analyticsRoutes from './routes/analytics.routes';
import activityRoutes from './routes/activity.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/courses',   courseRoutes);
app.use('/api/quizzes',   quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'LearnSphere API running ✅' }));

// DB + Server
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB error:', err));

export default app;