import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import RiskBadge from '@/components/shared/RiskBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    analyticsService.getAllStudents()
      .then(setStudents)
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Students</h1>
            <p className="text-sm text-muted-foreground">Monitor student progress and support levels</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <Card className="border shadow-sm">
          <CardHeader><CardTitle className="text-base font-semibold">Student List</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-muted-foreground">Student</th>
                    <th className="text-left py-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-4 font-medium text-muted-foreground">Courses</th>
                    <th className="text-left py-4 font-medium text-muted-foreground">Support Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-muted/30 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground">{s.email}</td>
                      <td className="font-medium">{s.enrolledCourses}</td>
                      <td><RiskBadge level={s.risk} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}