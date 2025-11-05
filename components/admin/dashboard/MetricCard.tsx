"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

function getChangeColor(changeType: 'positive' | 'negative' | 'neutral') {
  switch (changeType) {
    case 'positive': return 'text-green-600 dark:text-green-400';
    case 'negative': return 'text-red-600 dark:text-red-400';
    default: return 'text-muted-foreground';
  }
}

export const MetricCard = memo(function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description 
}: MetricCardProps) {
  return (
    <Card className="border-border bg-card hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={`text-xs mt-1 ${getChangeColor(changeType)}`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

