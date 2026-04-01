import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Course from '../models/Course.model';
import User from '../models/User.model';

// GET /api/courses
export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/courses/my
export const getMyCourses = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let courses;
    if (user.role === 'student') {
      courses = await Course.find({ enrolledStudents: req.userId });
    } else if (user.role === 'instructor') {
      courses = await Course.find({ instructorId: req.userId });
    } else {
      courses = await Course.find();
    }
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/courses/:id
export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/courses
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, videos, materials } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const course = await Course.create({
      title, description, category,
      videos: videos || [],
      materials: materials || [],
      instructorId: req.userId,
      instructorName: user.name,  // ← uses admin name as instructor
      enrolledStudents: [],
    });
    res.status(201).json(course);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/courses/:id/enroll
export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = course.enrolledStudents
      .map(id => id.toString())
      .includes(req.userId!);

    if (alreadyEnrolled)
      return res.status(400).json({ message: 'Already enrolled' });

    course.enrolledStudents.push(req.userId as any);
    await course.save();

    // Also update user's enrolledCourses
    await User.findByIdAndUpdate(req.userId, {
      $push: { enrolledCourses: course._id }
    });

    res.json({ message: 'Enrolled successfully', course });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};