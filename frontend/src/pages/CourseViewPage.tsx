import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { courseService } from '@/services/course.service';
import { quizService } from '@/services/quiz.service';
import { activityService } from '@/services/activity.service';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, FileText, CheckCircle, Clock, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseViewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse]           = useState<any>(null);
  const [quizzes, setQuizzes]         = useState<any[]>([]);
  const [activity, setActivity]       = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [enrolling, setEnrolling]     = useState(false);
  const [watchingId, setWatchingId]   = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const courseData = await courseService.getCourseById(id!);
        setCourse(courseData);
        const quizData = await quizService.getQuizzesByCourse(id!);
        setQuizzes(quizData);
        if (user?.role === 'student') {
          const actData = await activityService.getCourseActivity(id!);
          setActivity(actData);
        }
      } catch (err) {
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await courseService.enrollCourse(id!);
      toast.success('Enrolled successfully!');
      const data = await courseService.getCourseById(id!);
      setCourse(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  // Open video player modal
  const handleWatchVideo = async (video: any) => {
    setActiveVideo(video);

    // Track progress for students
    if (user?.role === 'student' && isEnrolled) {
      setWatchingId(video._id);
      try {
        const updatedActivity = await activityService.updateVideoProgress(
          id!, video._id, 100, video.duration
        );
        setActivity(updatedActivity);
      } catch (err) {
        console.error('Failed to update progress');
      } finally {
        setWatchingId(null);
      }
    }
  };

  const getVideoProgress = (videoId: string): number => {
    if (!activity?.videoProgress) return 0;
    if (activity.videoProgress instanceof Map) {
      return activity.videoProgress.get(videoId) || 0;
    }
    return activity.videoProgress[videoId] || 0;
  };

  const isEnrolled = course?.enrolledStudents
    ?.map((s: any) => s.toString())
    .includes(user?.id);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  if (!course) return (
    <DashboardLayout>
      <p className="text-muted-foreground">Course not found.</p>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h2 className="font-semibold text-lg">{activeVideo.title}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activeVideo.duration} min
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveVideo(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black">
                {activeVideo.url && activeVideo.url !== '#' ? (
                  <iframe
                    src={activeVideo.url}
                    title={activeVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center space-y-3">
                      <Play className="h-16 w-16 mx-auto opacity-40" />
                      <p className="text-muted-foreground">Video not available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 flex items-center justify-between border-t">
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'student' && isEnrolled
                    ? '✅ Progress tracked automatically'
                    : 'Enroll to track your progress'}
                </p>
                <Button variant="outline" onClick={() => setActiveVideo(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Course Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {course.category}
            </span>
            <h1 className="text-2xl font-bold mt-2">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
            <p className="text-sm text-muted-foreground mt-1">By {course.instructorName}</p>
          </div>

          {user?.role === 'student' && !isEnrolled && (
            <Button onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}

          {user?.role === 'student' && isEnrolled && activity && (
            <div className="shrink-0 w-48 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{activity.completionPercentage}%</span>
              </div>
              <Progress value={activity.completionPercentage} className="h-2" />
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="videos">
          <TabsList>
            <TabsTrigger value="videos">Videos ({course.videos?.length || 0})</TabsTrigger>
            <TabsTrigger value="materials">Materials ({course.materials?.length || 0})</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes ({quizzes.length})</TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-3 mt-4">
            {course.videos?.map((video: any) => {
              const progress  = getVideoProgress(video._id);
              const isWatched = progress >= 100;
              const isLoading = watchingId === video._id;

              return (
                <Card
                  key={video._id}
                  className={`hover:shadow-md transition-shadow ${isWatched ? 'border-green-500/40' : ''}`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isWatched ? 'bg-green-100' : 'bg-primary/10'}`}>
                        {isWatched
                          ? <CheckCircle className="h-5 w-5 text-green-600" />
                          : <Play className="h-5 w-5 text-primary" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {video.duration} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Progress bar for students */}
                      {user?.role === 'student' && isEnrolled && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                          <Progress value={progress} className="w-20 h-1.5" />
                        </div>
                      )}

                      {/* Watch Button */}
                      <Button
                        size="sm"
                        variant={isWatched ? 'outline' : 'default'}
                        onClick={() => handleWatchVideo(video)}
                        disabled={isLoading}
                      >
                        {isLoading
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : isWatched ? '▶ Rewatch' : '▶ Watch'
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-3 mt-4">
            {course.materials?.length === 0 && (
              <p className="text-muted-foreground text-sm">No materials yet.</p>
            )}
            {course.materials?.map((mat: any) => (
              <Card key={mat._id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{mat.title}</p>
                    <p className="text-xs text-muted-foreground uppercase">{mat.type}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-3 mt-4">
            {quizzes.length === 0 ? (
              <p className="text-muted-foreground text-sm">No quizzes yet.</p>
            ) : (
              quizzes.map((quiz: any) => (
                <Card key={quiz._id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {quiz.questions?.length} questions
                      </p>
                    </div>
                    <Link to={`/quiz/${quiz._id}`}>
                      <Button size="sm">Take Quiz</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}