"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalIncrements: number;
  totalReferrals: number;
  referralEarnings: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  userGrowth: number;
  depositGrowth: number;
  withdrawalGrowth: number;
}

export function DashboardStats() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalIncrements: 0,
    totalReferrals: 0,
    referralEarnings: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    userGrowth: 0,
    depositGrowth: 0,
    withdrawalGrowth: 0,
  });

  // Set up refresh event listener
  useEffect(() => {
    const handleRefresh = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('dashboard:refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('dashboard:refresh', handleRefresh);
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch stats from the API
        const response = await fetch('/api/admin/dashboard/stats');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStat = (title: string, value: string | number, growth: number, description: string) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <div className={`flex items-center text-sm font-medium ${growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {growth >= 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(growth)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSkeleton = () => (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="py-4">
          <div className="text-center text-red-500">
            Error loading dashboard stats: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {renderStat(
        "Total Users", 
        stats.totalUsers, 
        stats.userGrowth, 
        "All registered users"
      )}
      
      {renderStat(
        "Active Users", 
        stats.activeUsers, 
        stats.activeUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0, 
        "Users active in last 30 days"
      )}
      
      {renderStat(
        "Total Deposits", 
        formatCurrency(stats.totalDeposits), 
        stats.depositGrowth, 
        "All-time deposit volume"
      )}
      
      {renderStat(
        "Total Withdrawals", 
        formatCurrency(stats.totalWithdrawals), 
        stats.withdrawalGrowth, 
        "All-time withdrawal volume"
      )}
      
      {renderStat(
        "Total Increments", 
        formatCurrency(stats.totalIncrements), 
        stats.totalIncrements > 0 ? Math.round((stats.totalIncrements / stats.totalDeposits) * 10) : 0, 
        "Total profit distributed"
      )}
      
      {renderStat(
        "Referral Earnings", 
        formatCurrency(stats.referralEarnings), 
        stats.referralEarnings > 0 ? Math.round((stats.referralEarnings / stats.totalIncrements) * 100) : 0, 
        "Total referral commissions"
      )}
    </div>
  );
} 