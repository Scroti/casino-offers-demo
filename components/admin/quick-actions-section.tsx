'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Gift, 
  Users, 
  Newspaper, 
  BarChart3,
  Settings,
  FileText,
  Mail,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  badge?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'add-bonus',
    title: 'Add New Bonus',
    description: 'Create a new casino bonus offer',
    icon: Plus,
    href: '/admin/bonuses-management',
    color: 'bg-blue-500 hover:bg-blue-600',
    badge: 'Popular'
  },
  {
    id: 'manage-users',
    title: 'User Management',
    description: 'View and manage user accounts',
    icon: Users,
    href: '/admin/user-management',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    description: 'Manage newsletter subscriptions',
    icon: Mail,
    href: '/admin/newsletter',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'View detailed analytics and reports',
    icon: BarChart3,
    href: '/admin/analytics',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'content',
    title: 'Content Management',
    description: 'Manage casino listings and content',
    icon: FileText,
    href: '/admin/content',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure system settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-gray-500 hover:bg-gray-600'
  }
];

const pendingTasks = [
  {
    id: '1',
    title: 'Review pending casino applications',
    count: 3,
    priority: 'high' as const
  },
  {
    id: '2',
    title: 'Update bonus terms and conditions',
    count: 1,
    priority: 'medium' as const
  },
  {
    id: '3',
    title: 'Respond to user complaints',
    count: 7,
    priority: 'high' as const
  },
  {
    id: '4',
    title: 'Generate monthly reports',
    count: 1,
    priority: 'low' as const
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export function QuickActionsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  className={`w-full h-auto p-3 justify-start ${action.color} text-white border-0 hover:opacity-90 transition-opacity`}
                  asChild
                >
                  <a href={action.href}>
                    <div className="flex items-center space-x-3 w-full">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{action.title}</span>
                          {action.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Pending Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {task.count} item{task.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
