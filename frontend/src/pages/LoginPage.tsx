import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Invalid credentials');
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Sign in to your LearnSphere account
            </CardDescription>
          </div>

        </CardHeader>

        {/* Form */}
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-600">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-11 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-zinc-600">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-11 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-zinc-500">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register
            </Link>
          </div>
        </CardContent>

      </Card>
    </div>
  );
}