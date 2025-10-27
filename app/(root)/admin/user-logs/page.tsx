// app/admin/logs/page.tsx
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function ActivityLogsPage() {
  const [filters, setFilters] = useState({
    action: '',
    category: '',
    userId: '',
  });

  // Local placeholder for logs data to avoid "Cannot find name 'data'".
  // Replace with real data fetching (useEffect/fetch or a prop) as needed.
  const [data, setData] = useState<{ logs: any[] }>({ logs: [] });


  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth': return 'default';
      case 'user': return 'secondary';
      case 'admin': return 'destructive';
      case 'system': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Activity Logs</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search action..."
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
        />
        <Select
          value={filters.category}
          onValueChange={(value: any) => setFilters({ ...filters, category: value })}
        >
          <option value="">All Categories</option>
          <option value="auth">Authentication</option>
          <option value="user">User Actions</option>
          <option value="admin">Admin Actions</option>
          <option value="system">System</option>
        </Select>
      </div>

      {/* Logs Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.logs.map((log:any) => (
            <TableRow key={log._id}>
              <TableCell>
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>{log.userId?.email || 'Anonymous'}</TableCell>
              <TableCell className="font-mono text-sm">{log.action}</TableCell>
              <TableCell>
                <Badge variant={getCategoryColor(log.category)}>
                  {log.category}
                </Badge>
              </TableCell>
              <TableCell>{log.ipAddress}</TableCell>
              <TableCell>
                {log.metadata && (
                  <pre className="text-xs">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
