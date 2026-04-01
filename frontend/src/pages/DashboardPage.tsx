import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import InstructorDashboard from '@/components/dashboards/InstructorDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {user?.role === 'student' && <StudentDashboard />}
      {user?.role === 'instructor' && <InstructorDashboard />}
      {user?.role === 'admin' && <AdminDashboard />}
    </DashboardLayout>
  );
}
