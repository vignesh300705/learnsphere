import React from 'react';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  className?: string;
}

export default function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
      level === 'low' && "bg-success/15 text-success",
      level === 'medium' && "bg-warning/15 text-warning",
      level === 'high' && "bg-destructive/15 text-destructive",
      className
    )}>
      {level === 'low' ? '● Low Risk' : level === 'medium' ? '● On Track' : '● High Risk'}
    </span>
  );
}
