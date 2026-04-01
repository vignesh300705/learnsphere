import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import RiskBadge from '@/components/shared/RiskBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InstructorAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getInstructorAnalytics()
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
        <div>
          <h1 className="text-3xl font-bold">Instructor Analytics</h1>
          <p className="text-sm text-muted-foreground">Monitor course performance and at-risk students</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card><CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="text-primary" />
            <div><p className="text-sm text-muted-foreground">Courses</p>
              <p className="text-xl font-bold">{data?.totalCourses || 0}</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex items-center gap-4">
            <Users className="text-primary" />
            <div><p className="text-sm text-muted-foreground">Students</p>
              <p className="text-xl font-bold">{data?.totalStudents || 0}</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex items-center gap-4">
            <AlertTriangle className="text-yellow-500" />
            <div><p className="text-sm text-muted-foreground">Needs Attention</p>
              <p className="text-xl font-bold">{data?.highRiskCount || 0}</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex items-center gap-4">
            <TrendingUp className="text-primary" />
            <div><p className="text-sm text-muted-foreground">Avg Completion</p>
              <p className="text-xl font-bold">{data?.avgCompletion || 0}%</p></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Completion Rate by Course</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.courseStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Students Needing Support</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.studentRisks || []).map((s: any) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <RiskBadge level={s.risk} />
                </div>
              ))}
              {(!data?.studentRisks || data.studentRisks.length === 0) && (
                <p className="text-muted-foreground text-sm text-center py-4">No student data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}