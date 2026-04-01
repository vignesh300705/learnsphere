import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, Shield, Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const COLORS = ['hsl(142,71%,45%)', 'hsl(217,91%,60%)', 'hsl(262,83%,58%)'];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAdminAnalytics()
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

  const roleData = [
    { name: 'Students', value: data?.students || 0 },
    { name: 'Instructors', value: data?.instructors || 0 },
    { name: 'Admins', value: 1 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Analytics</h1>
          <p className="text-sm text-muted-foreground">Overview of platform activity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-6 flex items-center gap-4">
            <Users className="text-primary" />
            <div><p className="text-sm text-muted-foreground">Students</p>
              <p className="text-xl font-bold">{data?.students || 0}</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex items-center gap-4">
            <Shield className="text-primary" />
            <div><p className="text-sm text-muted-foreground">Instructors</p>
              <p className="text-xl font-bold">{data?.instructors || 0}</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="text-primary" />
            <div><p className="text-sm text-muted-foreground">Courses</p>
              <p className="text-xl font-bold">{data?.courses || 0}</p></div>
          </CardContent></Card>

          <Card><CardContent className="p-6 flex items-center gap-4">
            <Activity className="text-primary" />
            <div><p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-xl font-bold">{(data?.students || 0) + (data?.instructors || 0)}</p></div>
          </CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Course Enrollment</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data?.courseEnrollmentData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enrolled" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>User Distribution</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}