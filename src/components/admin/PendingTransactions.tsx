"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface PendingTransactionsData {
  pendingDeposits: number;
  pendingWithdrawals: number;
  recentDeposits: Array<{
    _id: string;
    amount: number;
    createdAt: string;
    userId: {
      name: string;
      email: string;
    };
  }>;
  recentWithdrawals: Array<{
    _id: string;
    amount: number;
    createdAt: string;
    userId: {
      name: string;
      email: string;
    };
  }>;
}

export function PendingTransactions() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PendingTransactionsData>({
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    recentDeposits: [],
    recentWithdrawals: []
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
    const fetchPendingTransactions = async () => {
      try {
        setLoading(true);
        
        // Fetch pending transactions from the API
        const response = await fetch('/api/admin/dashboard/pending-transactions');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch pending transactions: ${response.status}`);
        }
        
        const responseData = await response.json();
        setData(responseData);
        setError(null);
      } catch (err) {
        console.error('Error fetching pending transactions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load pending transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTransactions();
  }, [refreshKey]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="bg-muted/40">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="text-center text-red-500">
            Error loading pending transactions: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>Transactions requiring your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
                    <ArrowDownToLine className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Deposit Requests</h4>
                    <p className="text-xs text-muted-foreground">{data.pendingDeposits} pending approvals</p>
                  </div>
                </div>
                <Link href="/admin/transactions/deposits" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              
              {data.recentDeposits.length > 0 && (
                <div className="mt-4 space-y-3">
                  {data.recentDeposits.map((deposit) => (
                    <div key={deposit._id} className="flex items-center justify-between text-sm p-2 border border-border/40 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">{deposit.userId.name}</div>
                        <div className="text-muted-foreground text-xs">{formatDate(deposit.createdAt)}</div>
                      </div>
                      <div className="font-semibold">{formatCurrency(deposit.amount)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-muted/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-amber-100 text-amber-500 mr-3">
                    <ArrowUpFromLine className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Withdrawal Requests</h4>
                    <p className="text-xs text-muted-foreground">{data.pendingWithdrawals} pending approvals</p>
                  </div>
                </div>
                <Link href="/admin/transactions/withdrawals" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              
              {data.recentWithdrawals.length > 0 && (
                <div className="mt-4 space-y-3">
                  {data.recentWithdrawals.map((withdrawal) => (
                    <div key={withdrawal._id} className="flex items-center justify-between text-sm p-2 border border-border/40 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">{withdrawal.userId.name}</div>
                        <div className="text-muted-foreground text-xs">{formatDate(withdrawal.createdAt)}</div>
                      </div>
                      <div className="font-semibold">{formatCurrency(withdrawal.amount)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 