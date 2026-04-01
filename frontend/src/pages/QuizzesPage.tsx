import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { quizService } from '@/services/quiz.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getAllQuizzes();
        setQuizzes(data);
      } catch (err) {
        toast.error('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
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
            Quizzes
          </h1>
          <p className="text-sm text-zinc-500">
            Test your knowledge and track your progress
          </p>
        </div>

        {/* Empty State */}
        {quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
              <FileText className="h-8 w-8 text-zinc-400" />
            </div>
            <p className="text-lg font-medium">No quizzes available</p>
            <p className="text-sm text-zinc-500 mt-1">
              New quizzes will appear here
            </p>
          </div>
        ) : (

          /* Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz: any) => (
              <Card
                key={quiz._id}
                className="group rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur border shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-5 flex flex-col justify-between h-full">

                  {/* Top */}
                  <div className="space-y-4">

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow">
                      <FileText className="h-5 w-5" />
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-semibold text-base leading-tight">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {quiz.courseId?.title || 'General'}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {quiz.questions?.length} Questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~10 min
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link to={`/quiz/${quiz._id}`} className="mt-5">
                    <Button className="w-full rounded-lg group-hover:scale-[1.02] transition-all">
                      Start Quiz
                    </Button>
                  </Link>

                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}