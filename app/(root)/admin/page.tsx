'use client';

import * as React from 'react';
import { DashboardOverviewCards } from '@/components/admin/dashboard-overview-cards';
import { RecentActivityTable } from '@/components/admin/recent-activity-table';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';
import { QuickActionsSection } from '@/components/admin/quick-actions-section';
import { RecentBonusesPreview } from '@/components/admin/recent-bonuses-preview';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your casino platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <DashboardOverviewCards />

      {/* Charts and Analytics */}
      <AnalyticsCharts />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Activity and Bonuses */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivityTable />
          <RecentBonusesPreview />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <QuickActionsSection />
        </div>
      </div>
    </div>
  );
}