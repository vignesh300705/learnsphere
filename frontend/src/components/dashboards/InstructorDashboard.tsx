import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analytics.service';
import StatCard from '@/components/shared/StatCard';
import RiskBadge from '@/components/shared/RiskBadge';
import { Users, BookOpen, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export default function InstructorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getInstructorAnalytics()
      .then(setData)
      .catch(err => console.error('Failed to load instructor analytics', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const riskDistribution = [
    { name: 'Low Risk', value: (data?.studentRisks || []).filter((s: any) => s.risk === 'low').length || 1 },
    { name: 'Medium Risk', value: (data?.studentRisks || []).filter((s: any) => s.risk === 'medium').length || 0 },
    { name: 'Needs Attention', value: (data?.studentRisks || []).filter((s: any) => s.risk === 'high').length || 0 },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Instructor Dashboard
        </h1>
        <p className="text-sm text-zinc-500">
          Monitor performance, engagement, and student risks
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Courses", value: data?.totalCourses || 0, icon: <BookOpen className="text-indigo-600" /> },
          { title: "Total Students", value: data?.totalStudents || 0, icon: <Users className="text-blue-600" /> },
          { title: "Avg Completion", value: `${data?.avgCompletion || 0}%`, icon: <TrendingUp className="text-green-600" /> },
          { title: "Needs Attention", value: data?.highRiskCount || 0, icon: <AlertTriangle className="text-red-500" /> },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border shadow-sm hover:shadow-xl transition">
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">

        <Card className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Completion by Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data?.courseStats || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completion" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Student Support Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  dataKey="value"
                  stroke="none"
                >
                  {riskDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Students Needing Support */}
      <Card className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Students Needing Support
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {(data?.studentRisks || []).length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No student data yet
            </p>
          ) : (
            (data?.studentRisks || []).map((s: any) => (
              <div
                key={s.name}
                className="flex items-center justify-between p-3 rounded-xl border bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xs font-bold shadow">
                    {s.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <RiskBadge level={s.risk} />
              </div>
            ))
          )}
        </CardContent>
      </Card>

    </div>
  );
}