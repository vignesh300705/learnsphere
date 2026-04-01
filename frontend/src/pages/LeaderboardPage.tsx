import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getLeaderboard()
      .then(setLeaderboard)
      .catch(() => toast.error('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  const topThree = leaderboard.slice(0, 3);
  const icons = [Trophy, Medal, Award];
  const iconColors = ['text-yellow-500', 'text-gray-400', 'text-orange-400'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard 🏆</h1>
          <p className="text-muted-foreground text-sm">Top performing students</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {topThree.map((s, i) => {
            const Icon = icons[i];
            return (
              <Card key={s.id} className={`text-center border ${i === 0 ? 'border-yellow-400 shadow-lg' : ''}`}>
                <CardContent className="pt-8 pb-6 flex flex-col items-center gap-3">
                  <Icon className={`h-8 w-8 ${iconColors[i]}`} />
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.points} points</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader><CardTitle>Student Rankings</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b">
                <tr>
                  <th className="text-left py-4 px-6">Rank</th>
                  <th className="text-left">Student</th>
                  <th className="text-left">Avg Score</th>
                  <th className="text-left">Completion</th>
                  <th className="text-left">Study Time</th>
                  <th className="text-left px-6">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((s, i) => (
                  <tr key={s.id} className="border-b hover:bg-muted/30 transition">
                    <td className="py-4 px-6 font-semibold">{i + 1}</td>
                    <td className="flex items-center gap-3 py-4">
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                        {s.name.charAt(0)}
                      </div>
                      {s.name}
                    </td>
                    <td>{s.avgScore}%</td>
                    <td>{s.avgCompletion}%</td>
                    <td>{Math.round(s.totalTime / 60)}h</td>
                    <td className="px-6 font-bold text-primary">{s.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}