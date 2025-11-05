'use client';

import { memo, useMemo } from 'react';
import { 
  Users, 
  Gift, 
  Star,
  Mail,
  Building2
} from 'lucide-react';
import { MetricCard } from './dashboard/MetricCard';
import { useGetAllUsersQuery } from '@/app/lib/data-access/configs/users.config';
import { useGetAllBonusesQuery } from '@/app/lib/data-access/configs/bonuses.config';
import { useGetAllCasinosQuery } from '@/app/lib/data-access/configs/casinos.config';
import { useGetAllContactsQuery } from '@/app/lib/data-access/configs/contact-management.config';

export const DashboardOverviewCards = memo(function DashboardOverviewCards() {
  const { data: users = [], isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: bonuses = [], isLoading: bonusesLoading } = useGetAllBonusesQuery();
  const { data: casinos = [], isLoading: casinosLoading } = useGetAllCasinosQuery();
  const { data: contacts = [], isLoading: contactsLoading } = useGetAllContactsQuery();

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalBonuses = bonuses.length;
    const totalCasinos = casinos.length;
    const avgSafetyIndex = casinos.length > 0
      ? casinos.reduce((sum, c) => sum + (c.safetyIndex || 0), 0) / casinos.length
      : 0;
    const unreadContacts = contacts.filter(c => !c.isRead).length;
    const totalContacts = contacts.length;

    return {
      totalUsers,
      activeUsers,
      totalBonuses,
      totalCasinos,
      avgSafetyIndex,
      unreadContacts,
      totalContacts,
    };
  }, [users, bonuses, casinos, contacts]);

  const isLoading = usersLoading || bonusesLoading || casinosLoading || contactsLoading;

  const metrics = [
    {
      title: "Total Users",
      value: isLoading ? "..." : stats.totalUsers.toLocaleString(),
      change: `${stats.activeUsers} active`,
      changeType: "positive" as const,
      icon: Users,
      description: "Registered users"
    },
    {
      title: "Total Bonuses",
      value: isLoading ? "..." : stats.totalBonuses.toLocaleString(),
      change: "Available bonuses",
      changeType: "positive" as const,
      icon: Gift,
      description: "Active bonus offers"
    },
    {
      title: "Total Casinos",
      value: isLoading ? "..." : stats.totalCasinos.toLocaleString(),
      change: "Casino listings",
      changeType: "positive" as const,
      icon: Building2,
      description: "Registered casinos"
    },
    {
      title: "Avg Safety Index",
      value: isLoading ? "..." : stats.avgSafetyIndex > 0 ? stats.avgSafetyIndex.toFixed(1) : "0.0",
      change: "Across all casinos",
      changeType: stats.avgSafetyIndex >= 7 ? "positive" as const : stats.avgSafetyIndex >= 5 ? "neutral" as const : "negative" as const,
      icon: Star,
      description: "Average casino safety rating"
    },
    {
      title: "Support Tickets",
      value: isLoading ? "..." : stats.totalContacts.toLocaleString(),
      change: `${stats.unreadContacts} unread`,
      changeType: stats.unreadContacts > 0 ? "negative" as const : "positive" as const,
      icon: Mail,
      description: "Contact submissions"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
});
