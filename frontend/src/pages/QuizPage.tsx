import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { quizService } from '@/services/quiz.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(id!);
        setQuiz(data);
      } catch (err) {
        toast.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  if (!quiz) return (
    <DashboardLayout>
      <p className="text-muted-foreground">Quiz not found.</p>
    </DashboardLayout>
  );

  const progress = (Object.keys(answers).length / quiz.questions.length) * 100;

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      toast.error('Please answer all questions');
      return;
    }
    setSubmitting(true);
    try {
      const res = await quizService.submitQuiz(id!, answers);
      setResult(res);
      setSubmitted(true);
      toast.success(`You scored ${res.score}/${res.totalQuestions}!`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Submission failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {quiz.questions.length} Questions
            </span>
          </div>
          {!submitted && (
            <div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Object.keys(answers).length} / {quiz.questions.length} answered
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        {submitted && result && (
          <Card className="border-primary text-center">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-2">Quiz Result</h2>
              <p className="text-4xl font-bold text-primary">
                {result.score}/{result.totalQuestions}
              </p>
              <p className="text-2xl font-semibold text-muted-foreground mt-1">
                {result.percentage}%
              </p>
              <p className="text-muted-foreground mt-2">
                {result.percentage >= 70 ? 'Great job! 🎉' : 'Keep practicing! 💪'}
              </p>
              <Button className="mt-5" onClick={() => navigate(-1)}>
                Back to Course
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Questions */}
        {quiz.questions.map((q: any, qi: number) => {
          const qId = q._id.toString();
          const isCorrect = submitted && answers[qId] === q.correctAnswer;
          const isWrong = submitted && answers[qId] !== q.correctAnswer;

          return (
            <Card key={qId} className={`transition ${
              submitted
                ? isCorrect ? 'border-green-500/50' : 'border-red-500/50'
                : ''
            }`}>
              <CardHeader>
                <CardTitle className="flex items-start gap-2 text-base">
                  <span className="text-muted-foreground">Q{qi + 1}.</span>
                  <span>{q.question}</span>
                  {submitted && (isCorrect
                    ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    : <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[qId]?.toString()}
                  onValueChange={(v) =>
                    !submitted && setAnswers(prev => ({ ...prev, [qId]: parseInt(v) }))
                  }
                  disabled={submitted}
                >
                  {q.options.map((opt: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <RadioGroupItem value={i.toString()} id={`${qId}-${i}`} />
                      <Label
                        htmlFor={`${qId}-${i}`}
                        className={`cursor-pointer ${
                          submitted
                            ? i === q.correctAnswer
                              ? 'text-green-600 font-medium'
                              : answers[qId] === i
                              ? 'text-red-500'
                              : 'text-muted-foreground'
                            : ''
                        }`}
                      >
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          );
        })}

        {!submitted && (
          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </div>
    </DashboardLayout>
  );
}