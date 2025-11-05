'use client';

import * as React from 'react';
import { Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { DashboardOverviewCards } from '@/components/admin/dashboard-overview-cards';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';

function AdminDashboardContent() {
  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    // Set time only on client side to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleString());
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your casino platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Last updated: {currentTime || 'Loading...'}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <DashboardOverviewCards />

      {/* Charts and Analytics */}
      <AnalyticsCharts />
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading dashboard...</p>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}