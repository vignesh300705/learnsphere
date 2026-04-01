import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Platform configuration</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> General Settings
          </CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Settings panel coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}