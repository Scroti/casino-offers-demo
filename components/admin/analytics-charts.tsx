'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';

// Mock chart data
const monthlyStats = [
  { month: 'Jan', users: 1200, revenue: 4500, bonuses: 12 },
  { month: 'Feb', users: 1350, revenue: 5200, bonuses: 15 },
  { month: 'Mar', users: 1480, revenue: 6100, bonuses: 18 },
  { month: 'Apr', users: 1620, revenue: 7200, bonuses: 22 },
  { month: 'May', users: 1750, revenue: 8400, bonuses: 25 },
  { month: 'Jun', users: 1890, revenue: 9200, bonuses: 28 },
];

const bonusCategories = [
  { name: 'No Deposit', value: 35, color: 'bg-blue-500' },
  { name: 'Welcome Bonus', value: 28, color: 'bg-green-500' },
  { name: 'Reload Bonus', value: 20, color: 'bg-yellow-500' },
  { name: 'Cashback', value: 17, color: 'bg-purple-500' },
];

const topCasinos = [
  { name: 'Casino Royal', rating: 4.8, bonuses: 12, revenue: 2400 },
  { name: 'Lucky Casino', rating: 4.7, bonuses: 10, revenue: 2100 },
  { name: 'Mega Casino', rating: 4.6, bonuses: 8, revenue: 1800 },
  { name: 'Golden Palace', rating: 4.5, bonuses: 6, revenue: 1500 },
  { name: 'Diamond Casino', rating: 4.4, bonuses: 5, revenue: 1200 },
];

function SimpleBarChart({ data, dataKey, color = 'bg-blue-500' }: { 
  data: any[], 
  dataKey: string, 
  color?: string 
}) {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  
  return (
    <div className="flex items-end space-x-2 h-32">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className={`w-full ${color} rounded-t`}
            style={{ 
              height: `${(item[dataKey] / maxValue) * 100}%`,
              minHeight: '4px'
            }}
          />
          <span className="text-xs text-muted-foreground mt-2">
            {item.month}
          </span>
        </div>
      ))}
    </div>
  );
}

function SimplePieChart({ data }: { data: { name: string, value: number, color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm">{item.name}</span>
          </div>
          <div className="text-sm font-medium">{item.value}%</div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monthly Revenue</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={monthlyStats} dataKey="revenue" color="bg-green-500" />
          <div className="mt-4 text-sm text-muted-foreground">
            Total: ${monthlyStats[monthlyStats.length - 1].revenue.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* User Growth Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Growth</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2%
            </Badge>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={monthlyStats} dataKey="users" color="bg-blue-500" />
          <div className="mt-4 text-sm text-muted-foreground">
            Total: {monthlyStats[monthlyStats.length - 1].users.toLocaleString()} users
          </div>
        </CardContent>
      </Card>

      {/* Bonus Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Bonus Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <SimplePieChart data={bonusCategories} />
        </CardContent>
      </Card>

      {/* Top Performing Casinos */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Casinos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCasinos.map((casino, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{casino.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {casino.bonuses} bonuses • ${casino.revenue} revenue
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    ⭐ {casino.rating}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
