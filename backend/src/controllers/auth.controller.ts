import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const generateToken = (id: string, role: string) =>
  jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: 604800 } // 7 days in seconds (7 * 24 * 60 * 60)
  );


// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: [],
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('REGISTER ERROR:', err.message);
    
    // Handle mongoose validation errors nicely
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: user.enrolledCourses,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses,
      createdAt: user.createdAt,
    });
  } catch (err: any) {
    console.error('GETME ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};