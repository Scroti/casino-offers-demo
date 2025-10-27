'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Gift, 
  TrendingUp, 
  DollarSign,
  Activity,
  Star,
  Eye,
  UserPlus
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description 
}: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()}`}>
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
}

export function DashboardOverviewCards() {
  const metrics = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: Users,
      description: "Active registered users"
    },
    {
      title: "Active Bonuses",
      value: "47",
      change: "+3 new this week",
      changeType: "positive" as const,
      icon: Gift,
      description: "Currently available bonuses"
    },
    {
      title: "Revenue",
      value: "$24,567",
      change: "+8.2% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Monthly commission revenue"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.1% from last month",
      changeType: "negative" as const,
      icon: TrendingUp,
      description: "Visitor to user conversion"
    },
    {
      title: "Page Views",
      value: "156,789",
      change: "+15.3% from last month",
      changeType: "positive" as const,
      icon: Eye,
      description: "Total monthly page views"
    },
    {
      title: "New Signups",
      value: "1,234",
      change: "+22.1% from last month",
      changeType: "positive" as const,
      icon: UserPlus,
      description: "New user registrations"
    },
    {
      title: "Avg Rating",
      value: "4.7",
      change: "+0.2 from last month",
      changeType: "positive" as const,
      icon: Star,
      description: "Average casino rating"
    },
    {
      title: "Active Sessions",
      value: "2,847",
      change: "+5.4% from last hour",
      changeType: "positive" as const,
      icon: Activity,
      description: "Currently online users"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
