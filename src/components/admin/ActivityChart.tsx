"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  deposits: Array<{
    date: string;
    value: number;
  }>;
  withdrawals: Array<{
    date: string;
    value: number;
  }>;
  increments: Array<{
    date: string;
    value: number;
  }>;
  users: Array<{
    date: string;
    value: number;
  }>;
}

export function ActivityChart() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChartData>({
    deposits: [],
    withdrawals: [],
    increments: [],
    users: []
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
    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        // Fetch chart data from the API
        const response = await fetch('/api/admin/dashboard/activity-chart');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch activity data: ${response.status}`);
        }
        
        const responseData = await response.json();
        setData(responseData);
        setError(null);
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [refreshKey]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Custom tooltip formatter for financial data
  const currencyTooltipFormatter = (value: number) => formatCurrency(value);
  
  // Custom tooltip formatter for user counts
  const userTooltipFormatter = (value: number) => `${value} users`;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="text-center text-red-500">
            Error loading activity data: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for charts
  const processedDeposits = data.deposits.map(item => ({
    date: formatDate(item.date),
    Deposits: item.value
  }));
  
  const processedWithdrawals = data.withdrawals.map(item => ({
    date: formatDate(item.date),
    Withdrawals: item.value
  }));
  
  const processedIncrements = data.increments.map(item => ({
    date: formatDate(item.date),
    Increments: item.value
  }));
  
  const processedUsers = data.users.map(item => ({
    date: formatDate(item.date),
    Users: item.value
  }));

  // Combine deposits and withdrawals for the transactions chart
  const transactionsData = processedDeposits.map((item, index) => ({
    date: item.date,
    Deposits: item.Deposits,
    Withdrawals: processedWithdrawals[index]?.Withdrawals || 0,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>Platform activity over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs defaultValue="transactions">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="increments">Increments</TabsTrigger>
              <TabsTrigger value="users">User Growth</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="transactions" className="px-2 pt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={currencyTooltipFormatter} />
                  <Tooltip 
                    formatter={currencyTooltipFormatter}
                    contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', border: '1px solid #333', borderRadius: '6px' }} 
                  />
                  <Legend />
                  <Bar dataKey="Deposits" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Withdrawals" fill="#ffc658" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="increments" className="px-2 pt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedIncrements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={currencyTooltipFormatter} />
                  <Tooltip 
                    formatter={currencyTooltipFormatter}
                    contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', border: '1px solid #333', borderRadius: '6px' }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Increments" stroke="#00E5B3" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="users" className="px-2 pt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedUsers} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={userTooltipFormatter}
                    contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', border: '1px solid #333', borderRadius: '6px' }} 
                  />
                  <Line type="monotone" dataKey="Users" stroke="#FFD700" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 