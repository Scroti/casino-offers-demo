'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Gift, 
  Star, 
  ExternalLink,
  TrendingUp,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react';

interface Bonus {
  id: string;
  title: string;
  description: string;
  casino: string;
  casinoLogo: string;
  type: 'no-deposit' | 'welcome' | 'reload' | 'cashback';
  amount: string;
  rating: number;
  claims: number;
  revenue: number;
  status: 'active' | 'pending' | 'expired';
  createdAt: string;
}

const mockBonuses: Bonus[] = [
  {
    id: '1',
    title: 'Welcome Bonus Package',
    description: 'Get up to $1000 + 200 free spins',
    casino: 'Casino Royal',
    casinoLogo: 'https://github.com/shadcn.png',
    type: 'welcome',
    amount: '$1000',
    rating: 4.8,
    claims: 1247,
    revenue: 2400,
    status: 'active',
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    title: 'No Deposit Free Spins',
    description: '50 free spins on registration',
    casino: 'Lucky Casino',
    casinoLogo: 'https://github.com/shadcn.png',
    type: 'no-deposit',
    amount: '50 Spins',
    rating: 4.7,
    claims: 892,
    revenue: 1800,
    status: 'active',
    createdAt: '4 hours ago'
  },
  {
    id: '3',
    title: 'Reload Bonus',
    description: '50% bonus up to $500',
    casino: 'Mega Casino',
    casinoLogo: 'https://github.com/shadcn.png',
    type: 'reload',
    amount: '$500',
    rating: 4.6,
    claims: 634,
    revenue: 1500,
    status: 'active',
    createdAt: '6 hours ago'
  },
  {
    id: '4',
    title: 'Cashback Bonus',
    description: '10% weekly cashback',
    casino: 'Golden Palace',
    casinoLogo: 'https://github.com/shadcn.png',
    type: 'cashback',
    amount: '10%',
    rating: 4.5,
    claims: 423,
    revenue: 1200,
    status: 'pending',
    createdAt: '1 day ago'
  },
  {
    id: '5',
    title: 'VIP Welcome Package',
    description: 'Exclusive $2000 + 500 spins',
    casino: 'Diamond Casino',
    casinoLogo: 'https://github.com/shadcn.png',
    type: 'welcome',
    amount: '$2000',
    rating: 4.4,
    claims: 156,
    revenue: 800,
    status: 'active',
    createdAt: '2 days ago'
  }
];

const getTypeColor = (type: Bonus['type']) => {
  switch (type) {
    case 'no-deposit':
      return 'bg-green-100 text-green-800';
    case 'welcome':
      return 'bg-blue-100 text-blue-800';
    case 'reload':
      return 'bg-purple-100 text-purple-800';
    case 'cashback':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: Bonus['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function RecentBonusesPreview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Gift className="h-5 w-5" />
          <span>Recent Bonuses</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockBonuses.map((bonus) => (
            <div key={bonus.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-12 w-12">
                <AvatarImage src={bonus.casinoLogo} />
                <AvatarFallback>
                  {bonus.casino.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium truncate">{bonus.title}</h4>
                  <Badge className={getTypeColor(bonus.type)}>
                    {bonus.type.replace('-', ' ')}
                  </Badge>
                  <Badge className={getStatusColor(bonus.status)}>
                    {bonus.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{bonus.description}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{bonus.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{bonus.claims.toLocaleString()} claims</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>${bonus.revenue.toLocaleString()} revenue</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{bonus.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{bonus.amount}</div>
                <div className="text-sm text-muted-foreground">{bonus.casino}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">Total Revenue:</span>
                <span className="font-medium">$7,700</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-muted-foreground">Total Claims:</span>
                <span className="font-medium">3,352</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage Bonuses
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
