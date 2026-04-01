import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { courseService } from '@/services/course.service';
import { Course } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Play, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = user?.role === 'admin'
          ? await courseService.getAllCourses()
          : await courseService.getMyCourses();
        setCourses(data);
      } catch (err) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {user?.role === 'student' ? 'My Courses' : 'Courses'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {courses.length} available courses
            </p>
          </div>
          {user?.role === 'instructor' && (
            <Button>Create Course</Button>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm">
              {user?.role === 'student'
                ? 'You are not enrolled in any courses yet'
                : 'No courses created yet'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => {
              const totalDuration = course.videos?.reduce(
                (s: number, v: any) => s + v.duration, 0
              ) || 0;

              return (
                <Link to={`/course/${course._id}`} key={course._id}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full group">
                    <div className="h-36 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-primary opacity-70 group-hover:scale-110 transition" />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {course.category}
                      </span>
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {course.videos?.length || 0} videos
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.enrolledStudents?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {totalDuration}m
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}