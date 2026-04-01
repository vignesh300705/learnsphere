import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Play, FileText, Lightbulb, Loader2 } from 'lucide-react';
import RiskBadge from '@/components/shared/RiskBadge';
import { toast } from 'sonner';

const icons: any = { review: BookOpen, practice: FileText, video: Play, resource: Lightbulb };

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getRecommendations()
      .then(setRecommendations)
      .catch(() => toast.error('Failed to load recommendations'))
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
            Personalized Recommendations
          </h1>
          <p className="text-sm text-zinc-500">
            AI-powered suggestions to improve your learning
          </p>
        </div>

        {/* Empty State */}
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
              <Lightbulb className="h-8 w-8 text-zinc-400" />
            </div>
            <p className="text-lg font-medium">No recommendations yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Complete quizzes to unlock personalized suggestions
            </p>
          </div>
        ) : (

          /* List */
          <div className="space-y-4">
            {recommendations.map((rec: any) => {
              const Icon = icons[rec.type] || Lightbulb;

              return (
                <Card
                  key={rec._id}
                  className="group rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-5 flex items-start gap-4">

                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">

                      {/* Title + Badge */}
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-sm md:text-base">
                          {rec.title}
                        </h3>
                        <RiskBadge level={rec.priority} />
                      </div>

                      {/* Description */}
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        {rec.description}
                      </p>

                      {/* Related */}
                      {rec.relatedCourse && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          Related: {rec.relatedCourse?.title || rec.relatedCourse}
                        </p>
                      )}

                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}