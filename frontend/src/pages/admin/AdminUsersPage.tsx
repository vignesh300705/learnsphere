import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    analyticsService.getAdminAnalytics()
      .then(data => setUsers(data.allUsers || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl font-bold">All Users</h1>
            <p className="text-sm text-muted-foreground">Manage platform users</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">User List ({filtered.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-4 font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u: any) => (
                    <tr key={u._id} className="border-b hover:bg-muted/30 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-muted-foreground">{u.email}</td>
                      <td className="py-4">
                        <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium
                          ${u.role === 'admin' ? 'bg-red-100 text-red-600' :
                            u.role === 'instructor' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-muted-foreground">
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
    </DashboardLayout>
  );
}