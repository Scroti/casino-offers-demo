'use client';

import * as React from 'react';
import { Suspense } from 'react';

// Force dynamic rendering for this page - must be before any imports
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MousePointerClick,
  TrendingUp,
  Calendar,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

function AdminAnalyticsPageContent() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const analyticsUrl = 'https://analytics.google.com/';

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Google Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics and visitor insights for your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          {gaId && (
            <Badge variant="secondary" className="text-sm">
              ID: {gaId}
            </Badge>
          )}
          <Button asChild variant="outline">
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
        </div>
      </div>

      {/* Setup Status */}
      {!gaId && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              Google Analytics Not Configured
            </CardTitle>
            <CardDescription>
              Add your Google Analytics Measurement ID to start tracking visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To set up Google Analytics:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Get your Measurement ID from Google Analytics (format: G-XXXXXXXXXX)</li>
                <li>Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in the root directory</li>
                <li>Add: <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID=G-HW4HZYZ5V7</code></li>
                <li><strong>Important:</strong> Stop your dev server (Ctrl+C) and restart it with <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code></li>
                <li>Refresh this page after restarting</li>
              </ol>
              <div className="p-3 bg-muted rounded text-sm">
                <strong>Note:</strong> Environment variables starting with <code>NEXT_PUBLIC_</code> must be available at build/start time. 
                Just adding them to the file isn&apos;t enough - you must restart the Next.js dev server.
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Cards */}
      {gaId && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  View in Google Analytics for real data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  View in Google Analytics for real data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  View in Google Analytics for real data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  View in Google Analytics for real data
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Google Analytics Reports */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Realtime Reports
                </CardTitle>
                <CardDescription>
                  View live visitor activity and page views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Monitor your website traffic in real-time. See who&apos;s on your site right now, 
                    which pages they&apos;re viewing, and where they came from.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a 
                      href="https://analytics.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Realtime Report
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Traffic Reports
                </CardTitle>
                <CardDescription>
                  Analyze visitor behavior and traffic sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Get insights into your traffic sources, user demographics, device usage, 
                    and page performance metrics.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a 
                      href="https://analytics.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Traffic Report
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Overview</CardTitle>
              <CardDescription>
                Access detailed analytics reports in Google Analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Audience</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Active Users</li>
                    <li>• New vs Returning</li>
                    <li>• Demographics</li>
                    <li>• Geographic Data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Acquisition</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Traffic Sources</li>
                    <li>• Campaign Performance</li>
                    <li>• Referral Sites</li>
                    <li>• Search Console</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Behavior</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Page Views</li>
                    <li>• Popular Pages</li>
                    <li>• User Flow</li>
                    <li>• Site Speed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Using Google Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Quick Access</h4>
                  <p>
                    Click the &quot;Open Google Analytics&quot; button above to view your full analytics dashboard. 
                    You can also access it directly at{' '}
                    <a 
                      href={analyticsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      analytics.google.com
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What to Track</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Monitor visitor traffic and page views</li>
                    <li>Analyze user behavior and engagement</li>
                    <li>Track conversion events (bonus clicks, casino views)</li>
                    <li>Review traffic sources and campaigns</li>
                    <li>Monitor site performance and speed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Custom Events</h4>
                  <p>
                    The application automatically tracks custom events like bonus clicks, casino views, 
                    and game plays. These events are available in Google Analytics under Events.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading analytics...</p>
      </div>
    }>
      <AdminAnalyticsPageContent />
    </Suspense>
  );
}

