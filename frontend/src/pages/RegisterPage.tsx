import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await register(name, email, password, role);

    if (result.success) {
      toast.success('Account created!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">

      <Card className="w-full max-w-md rounded-3xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur border shadow-xl">

        {/* Header */}
        <CardHeader className="text-center space-y-4">

          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Join LearnSphere today
            </CardDescription>
          </div>

        </CardHeader>

        {/* Form */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-2">

            <div className="space-y-2">
              <Label className="text-xs text-zinc-600">Full Name</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="h-11 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-600">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="h-11 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-600">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="h-11 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-600">Role</Label>
              <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 shadow-md">
              Create Account
            </Button>

          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>

        </CardContent>

      </Card>
    </div>
  );
}