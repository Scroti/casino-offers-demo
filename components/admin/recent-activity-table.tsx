'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Gift, 
  Star, 
  Eye, 
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActivityItem {
  id: string;
  type: 'user_signup' | 'bonus_claim' | 'review' | 'page_view';
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'user_signup',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://github.com/shadcn.png'
    },
    action: 'Signed up for newsletter',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: '2',
    type: 'bonus_claim',
    user: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com'
    },
    action: 'Claimed welcome bonus',
    target: 'Casino Royal',
    timestamp: '5 minutes ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'review',
    user: {
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    action: 'Left a 5-star review',
    target: 'Lucky Casino',
    timestamp: '12 minutes ago',
    status: 'success'
  },
  {
    id: '4',
    type: 'page_view',
    user: {
      name: 'Anonymous User',
      email: 'anonymous'
    },
    action: 'Viewed bonus page',
    target: 'No Deposit Bonuses',
    timestamp: '15 minutes ago',
    status: 'success'
  },
  {
    id: '5',
    type: 'user_signup',
    user: {
      name: 'Emma Davis',
      email: 'emma@example.com'
    },
    action: 'Created new account',
    timestamp: '23 minutes ago',
    status: 'success'
  },
  {
    id: '6',
    type: 'bonus_claim',
    user: {
      name: 'Alex Brown',
      email: 'alex@example.com'
    },
    action: 'Claimed deposit bonus',
    target: 'Mega Casino',
    timestamp: '31 minutes ago',
    status: 'pending'
  }
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'user_signup':
      return User;
    case 'bonus_claim':
      return Gift;
    case 'review':
      return Star;
    case 'page_view':
      return Eye;
    default:
      return User;
  }
};

const getStatusColor = (status: ActivityItem['status']) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
    case 'pending':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
    case 'failed':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const RecentActivityTable = memo(function RecentActivityTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" size="sm">
          View All
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{activity.user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{activity.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {activity.target && (
                      <Badge variant="outline">{activity.target}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {activity.timestamp}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Contact User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});
