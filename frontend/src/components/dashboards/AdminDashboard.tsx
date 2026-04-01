import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analytics.service';
import StatCard from '@/components/shared/StatCard';
import { Users, BookOpen, Activity, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAdminAnalytics()
      .then(setData)
      .catch(err => console.error('Failed to load admin analytics', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Admin Panel
        </h1>
        <p className="text-sm text-zinc-500">
          Platform insights and user management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Students", value: data?.students || 0, icon: <Users className="text-indigo-600" /> },
          { title: "Instructors", value: data?.instructors || 0, icon: <Shield className="text-blue-600" /> },
          { title: "Courses", value: data?.courses || 0, icon: <BookOpen className="text-violet-600" /> },
          {
            title: "Total Users",
            value: (data?.students || 0) + (data?.instructors || 0),
            icon: <Activity className="text-green-600" />
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur border shadow-sm hover:shadow-xl transition"
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Chart */}
      <Card className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Course Enrollment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data?.courseEnrollmentData || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="enrolled"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            All Users
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              
              {/* Header */}
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    Joined
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {(data?.allUsers || []).map((u: any) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
                  >
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xs font-bold">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-zinc-500">
                      {u.email}
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-1 rounded-md text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}