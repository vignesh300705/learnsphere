import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analyticsService } from '@/services/analytics.service';
import { courseService } from '@/services/course.service';
import StatCard from '@/components/shared/StatCard';
import CourseProgressCard from '@/components/shared/CourseProgressCard';
import { BookOpen, Clock, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, coursesData] = await Promise.all([
          analyticsService.getStudentAnalytics(),
          courseService.getMyCourses(),
        ]);
        setAnalytics(analyticsData);
        setCourses(coursesData);
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">

      {/* Welcome */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-indigo-100 mt-2 text-sm">
          Track your progress and keep learning consistently.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Enrolled Courses',
            value: courses.length,
            icon: <BookOpen className="h-5 w-5 text-indigo-600" />,
          },
          {
            title: 'Study Time',
            value: `${analytics?.totalHours || 0}h`,
            icon: <Clock className="h-5 w-5 text-blue-600" />,
          },
          {
            title: 'Avg Score',
            value: `${analytics?.avgQuizScore || 0}%`,
            icon: <Trophy className="h-5 w-5 text-yellow-500" />,
          },
          {
            title: 'Quizzes',
            value: analytics?.quizzesTaken || 0,
            icon: <TrendingUp className="h-5 w-5 text-green-600" />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/70 backdrop-blur border shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm border bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-700">
              Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics?.quizHistory || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="quiz" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-700">
              Time by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analytics?.courseTime || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <Card className="rounded-2xl shadow-sm border bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-700">
            My Courses
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No courses enrolled yet
            </p>
          ) : (
            courses.map((course: any) => (
              <div
                key={course._id}
                className="p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
              >
                <CourseProgressCard
                  label={course.title}
                  value={0}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}