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

// 🔐 CORS (important for Vercel frontend)
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

// Middleware
app.use(express.json());

// ✅ Root route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("LearnSphere API is running 🚀");
});

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/courses',   courseRoutes);
app.use('/api/quizzes',   quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity',  activityRoutes);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'LearnSphere API running ✅' });
});

// 🔧 Port fallback (important for Render)
const PORT = process.env.PORT || 10000;

// DB + Server
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    process.exit(1); // crash if DB fails
  });

export default app;