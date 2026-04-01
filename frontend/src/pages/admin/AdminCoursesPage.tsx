import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { courseService } from '@/services/course.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Users, Play, Loader2, Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const [courses, setCourses]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory]       = useState('');
  const [videos, setVideos]           = useState([
    { title: '', url: '', duration: '' }
  ]);
  const [materials, setMaterials] = useState([
    { title: '', type: 'pdf', url: '' }
  ]);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  // Video handlers
  const addVideo = () =>
    setVideos([...videos, { title: '', url: '', duration: '' }]);

  const removeVideo = (i: number) =>
    setVideos(videos.filter((_, idx) => idx !== i));

  const updateVideo = (i: number, field: string, value: string) => {
    const updated = [...videos];
    updated[i] = { ...updated[i], [field]: value };
    setVideos(updated);
  };

  // Material handlers
  const addMaterial = () =>
    setMaterials([...materials, { title: '', type: 'pdf', url: '' }]);

  const removeMaterial = (i: number) =>
    setMaterials(materials.filter((_, idx) => idx !== i));

  const updateMaterial = (i: number, field: string, value: string) => {
    const updated = [...materials];
    updated[i] = { ...updated[i], [field]: value };
    setMaterials(updated);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setVideos([{ title: '', url: '', duration: '' }]);
    setMaterials([{ title: '', type: 'pdf', url: '' }]);
  };

  const handleCreate = async () => {
    if (!title || !description || !category) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await courseService.createCourse({
        title,
        description,
        category,
        videos: videos
          .filter(v => v.title)
          .map(v => ({ ...v, duration: parseInt(v.duration) || 0 })),
        materials: materials.filter(m => m.title),
      });

      toast.success('Course created successfully!');
      setShowModal(false);
      resetForm();
      fetchCourses(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

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

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">All Courses</h1>
            <p className="text-sm text-muted-foreground">
              {courses.length} courses on platform
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Course
          </Button>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Card key={course._id} className="hover:shadow-lg transition">
              <div className="h-28 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-primary opacity-70" />
              </div>
              <CardContent className="p-5 space-y-3">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {course.category}
                </span>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {course.videos?.length || 0} videos
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {course.enrolledStudents?.length || 0} students
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">By {course.instructorName}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Course Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background">
                <h2 className="text-xl font-bold">Create New Course</h2>
                <Button variant="ghost" size="sm" onClick={() => { setShowModal(false); resetForm(); }}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Basic Information
                  </h3>

                  <div className="space-y-2">
                    <Label>Course Title *</Label>
                    <Input
                      placeholder="e.g. Data Structures & Algorithms"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Describe what students will learn..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Videos
                    </h3>
                    <Button variant="outline" size="sm" onClick={addVideo}>
                      <Plus className="h-3 w-3 mr-1" /> Add Video
                    </Button>
                  </div>

                  {videos.map((video, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Video {i + 1}
                        </span>
                        {videos.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVideo(i)}
                            className="text-red-500 hover:text-red-600 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Video title"
                        value={video.title}
                        onChange={e => updateVideo(i, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="YouTube embed URL (e.g. https://www.youtube.com/embed/xxxxx)"
                        value={video.url}
                        onChange={e => updateVideo(i, 'url', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={video.duration}
                        onChange={e => updateVideo(i, 'duration', e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {/* Materials */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Materials
                    </h3>
                    <Button variant="outline" size="sm" onClick={addMaterial}>
                      <Plus className="h-3 w-3 mr-1" /> Add Material
                    </Button>
                  </div>

                  {materials.map((mat, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Material {i + 1}
                        </span>
                        {materials.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMaterial(i)}
                            className="text-red-500 hover:text-red-600 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Material title"
                        value={mat.title}
                        onChange={e => updateMaterial(i, 'title', e.target.value)}
                      />
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={mat.type}
                        onChange={e => updateMaterial(i, 'type', e.target.value)}
                      >
                        <option value="pdf">PDF</option>
                        <option value="doc">Document</option>
                        <option value="link">Link</option>
                      </select>
                      <Input
                        placeholder="URL"
                        value={mat.url}
                        onChange={e => updateMaterial(i, 'url', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t sticky bottom-0 bg-background">
                <Button
                  variant="outline"
                  onClick={() => { setShowModal(false); resetForm(); }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={submitting}>
                  {submitting
                    ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</>
                    : <><Plus className="h-4 w-4 mr-2" /> Create Course</>
                  }
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}