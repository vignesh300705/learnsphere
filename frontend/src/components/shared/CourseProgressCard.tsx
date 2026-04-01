import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressRingProps {
  value: number;
  label: string;
  size?: 'sm' | 'md';
}

export default function CourseProgressCard({ value, label, size = 'md' }: ProgressRingProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground truncate">{label}</span>
        <span className="font-semibold text-card-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
