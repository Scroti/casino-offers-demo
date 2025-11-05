'use client';

import * as React from 'react';
import { Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { DashboardOverviewCards } from '@/components/admin/dashboard-overview-cards';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth.context';
import { useMeQuery } from '@/app/lib/data-access/configs/auth.config';
import { 
  ExternalLink, 
  AlertCircle,
  BarChart3,
  Calendar
} from 'lucide-react';

function AdminDashboardContent() {
  const [currentTime, setCurrentTime] = React.useState<string>('');
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const analyticsUrl = 'https://analytics.google.com/';
  const { accessToken } = useAuth();
  const { data: user } = useMeQuery(undefined, { skip: !accessToken });
  
  // Get admin username - use name or email as fallback
  const adminName = user?.name || user?.email?.split('@')[0] || 'Admin';

  React.useEffect(() => {
    // Set time only on client side to avoid hydration mismatch
    setCurrentTime(new Date().toLocaleString());
  }, []);

  return (
    <div className="space-y-6 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{adminName}</span>! Here&apos;s what&apos;s happening with your casino platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Last updated: <span className="text-foreground">{currentTime || 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <DashboardOverviewCards />

      {/* Charts and Analytics */}
      <AnalyticsCharts />

      {/* Google Analytics Info Card */}
      <Card className={!gaId ? 'border-destructive/50 bg-destructive/10 dark:bg-destructive/20' : 'border-border bg-card'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-foreground" />
              <CardTitle className="text-foreground">Google Analytics</CardTitle>
              {gaId && (
                <Badge variant="secondary" className="text-sm font-medium">
                  ID: {gaId}
                </Badge>
              )}
            </div>
            {gaId && (
              <Button asChild variant="outline" size="sm">
                <a 
                  href={analyticsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Google Analytics
                </a>
              </Button>
            )}
          </div>
          <CardDescription className="text-muted-foreground">
            {gaId 
              ? 'View detailed analytics and visitor insights for your platform'
              : 'Add your Google Analytics Measurement ID to start tracking visitors'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!gaId ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-destructive">
                <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
                <div className="space-y-2">
                  <p className="font-semibold text-foreground mb-2">Google Analytics Not Configured</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Get your Measurement ID from Google Analytics (format: G-XXXXXXXXXX)</li>
                    <li>Add it to your environment variables: <code className="bg-muted text-foreground px-1.5 py-0.5 rounded font-mono text-xs">NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</code></li>
                    <li>Restart your application for the changes to take effect</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">Quick Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Access your full analytics dashboard to view visitor traffic, page views, 
                    user behavior, and conversion events.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a 
                      href={analyticsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Realtime Report
                    </a>
                  </Button>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">What to Track</h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li>Visitor traffic and page views</li>
                    <li>User behavior and engagement</li>
                    <li>Conversion events (bonus clicks, casino views)</li>
                    <li>Traffic sources and campaigns</li>
                    <li>Site performance and speed</li>
                  </ul>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-md border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> The application automatically tracks custom events like bonus clicks, 
                  casino views, and game plays. These events are available in Google Analytics under Events.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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