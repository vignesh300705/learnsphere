import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BookOpen, Clock, TrendingUp, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getStudentAnalytics()
      .then(setData)
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Learning Analytics
          </h1>
          <p className="text-sm text-zinc-500">
            Track your performance, consistency, and growth
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Study Time",
              value: `${data?.totalHours || 0} hrs`,
              icon: <Clock className="text-indigo-600" />
            },
            {
              label: "Average Score",
              value: `${data?.avgQuizScore || 0}%`,
              icon: <Award className="text-yellow-500" />
            },
            {
              label: "Courses",
              value: data?.coursesCount || 0,
              icon: <BookOpen className="text-blue-600" />
            },
            {
              label: "Quizzes Taken",
              value: data?.quizzesTaken || 0,
              icon: <TrendingUp className="text-green-600" />
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm hover:shadow-xl transition"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">

          <Card className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Quiz Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data?.quizHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="quiz" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Time by Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data?.courseTime || []}>
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

      </div>
    </DashboardLayout>
  );
}