'use client';

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Star
} from 'lucide-react';
import { useGetAllCasinosQuery } from '@/app/lib/data-access/configs/casinos.config';
import { useGetAllBonusesQuery } from '@/app/lib/data-access/configs/bonuses.config';
import { useGetAllUsersQuery } from '@/app/lib/data-access/configs/users.config';
import Link from 'next/link';
import Image from 'next/image';

function SimplePieChart({ data }: { data: { name: string, value: number, color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        No bonus data available
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm">{item.name}</span>
          </div>
          <div className="text-sm font-medium">{Math.round((item.value / total) * 100)}%</div>
        </div>
      ))}
    </div>
  );
}

export const AnalyticsCharts = memo(function AnalyticsCharts() {
  const { data: casinos = [], isLoading: casinosLoading } = useGetAllCasinosQuery();
  const { data: bonuses = [], isLoading: bonusesLoading } = useGetAllBonusesQuery();
  const { data: users = [], isLoading: usersLoading } = useGetAllUsersQuery();

  // Calculate bonus categories distribution
  const bonusCategories = useMemo(() => {
    const categories: Record<string, number> = {};
    
    bonuses.forEach(bonus => {
      // Normalize bonus type
      let type = bonus.type?.toLowerCase().trim() || 'other';
      if (type === 'no-deposit' || type === 'no deposit' || type === 'nodeposit') {
        type = 'No Deposit';
      } else if (type === 'deposit') {
        type = 'Deposit';
      } else if (type === 'cashback' || type === 'cash back') {
        type = 'Cashback';
      } else if (type === 'other' || type === 'others') {
        type = 'Other';
      } else {
        // Capitalize first letter
        type = type.charAt(0).toUpperCase() + type.slice(1);
      }
      categories[type] = (categories[type] || 0) + 1;
    });

    const colors = {
      'No Deposit': 'bg-blue-500',
      'Deposit': 'bg-green-500',
      'Welcome Bonus': 'bg-yellow-500',
      'Reload Bonus': 'bg-orange-500',
      'Cashback': 'bg-purple-500',
      'Other': 'bg-gray-500',
    };

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      color: colors[name as keyof typeof colors] || 'bg-gray-500',
    }));
  }, [bonuses]);

  // Calculate user demographics
  const userDemographics = useMemo(() => {
    // Gender distribution
    const genderStats: Record<string, number> = {};
    users.forEach(user => {
      const gender = user.gender || 'Not specified';
      genderStats[gender] = (genderStats[gender] || 0) + 1;
    });

    // Age range distribution
    const ageStats: Record<string, number> = {};
    users.forEach(user => {
      const age = user.ageRange || 'Not specified';
      ageStats[age] = (ageStats[age] || 0) + 1;
    });

    // Country distribution (top 10)
    const countryStats: Record<string, number> = {};
    users.forEach(user => {
      const country = user.country || 'Not specified';
      countryStats[country] = (countryStats[country] || 0) + 1;
    });

    const topCountries = Object.entries(countryStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    return {
      gender: Object.entries(genderStats).map(([name, value]) => ({ name, value })),
      ageRange: Object.entries(ageStats).map(([name, value]) => ({ name, value })),
      countries: topCountries,
    };
  }, [users]);

  // Get top casinos by safety index/rating
  const topCasinos = useMemo(() => {
    return [...casinos]
      .filter(c => c.safetyIndex !== undefined && c.safetyIndex > 0)
      .sort((a, b) => (b.safetyIndex || 0) - (a.safetyIndex || 0))
      .slice(0, 5)
      .map((casino, index) => {
        // Count bonuses for this casino
        const bonusCount = bonuses.filter(b => {
          if (typeof b.casino === 'object' && b.casino !== null) {
            return (b.casino as any)._id === casino._id;
          }
          return b.casino === casino._id;
        }).length;

        return {
          ...casino,
          index: index + 1,
          bonusCount,
        };
      });
  }, [casinos, bonuses]);

  // Calculate user growth by month
  const userGrowthByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    
    users.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months[monthKey] = (months[monthKey] || 0) + 1;
      }
    });

    // Get last 6 months
    const last6Months: Array<{ month: string; users: number }> = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      last6Months.push({
        month: monthName,
        users: months[monthKey] || 0,
      });
    }

    return last6Months;
  }, [users]);

  const isLoading = casinosLoading || bonusesLoading || usersLoading;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* User Demographics - Gender */}
      <Card>
        <CardHeader>
          <CardTitle>User Demographics - Gender</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
          ) : (
            <SimplePieChart 
              data={userDemographics.gender.map(item => ({
                name: item.name === 'male' ? 'Male' : item.name === 'female' ? 'Female' : 'Prefer not to say',
                value: item.value,
                color: item.name === 'male' ? 'bg-blue-500' : item.name === 'female' ? 'bg-pink-500' : 'bg-gray-500'
              }))} 
            />
          )}
        </CardContent>
      </Card>

      {/* User Demographics - Age Range */}
      <Card>
        <CardHeader>
          <CardTitle>User Demographics - Age Range</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
          ) : (
            <SimplePieChart 
              data={userDemographics.ageRange.map(item => ({
                name: item.name === 'Not specified' ? 'Not specified' : item.name,
                value: item.value,
                color: 'bg-indigo-500'
              }))} 
            />
          )}
        </CardContent>
      </Card>

      {/* User Demographics - Top Countries */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>User Demographics - Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
          ) : userDemographics.countries.length > 0 ? (
            <div className="space-y-3">
              {userDemographics.countries.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.country}</span>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {item.count} {item.count === 1 ? 'user' : 'users'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8">
              No country data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Growth Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Growth (Last 6 Months)</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              {userGrowthByMonth.length > 0 && userGrowthByMonth[userGrowthByMonth.length - 1].users > 0 ? '+' : ''}
              {userGrowthByMonth.length > 0 ? userGrowthByMonth[userGrowthByMonth.length - 1].users : 0}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
          ) : userGrowthByMonth.length > 0 ? (
            <>
              <div className="flex items-end space-x-2 h-32">
                {userGrowthByMonth.map((item, index) => {
                  const maxValue = Math.max(...userGrowthByMonth.map(d => d.users), 1);
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ 
                          height: `${(item.users / maxValue) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                      <span className="text-xs text-muted-foreground mt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Total: {userGrowthByMonth.reduce((sum, m) => sum + m.users, 0).toLocaleString()} users
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8">
              No user data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bonus Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Bonus Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
          ) : (
            <SimplePieChart data={bonusCategories} />
          )}
        </CardContent>
      </Card>

      {/* Top Performing Casinos by Safety Index */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Top Performing Casinos (by Safety Index)
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/casinos-management">
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Loading...</div>
          ) : topCasinos.length > 0 ? (
            <div className="space-y-4">
              {topCasinos.map((casino) => (
                <div key={casino._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {casino.index}
                    </div>
                    {casino.logo && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={casino.logo}
                          alt={casino.name}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{casino.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {casino.bonusCount} {casino.bonusCount === 1 ? 'bonus' : 'bonuses'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {casino.safetyIndex?.toFixed(1)}/10
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/casinos-management`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8">
              No casinos with safety index data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
