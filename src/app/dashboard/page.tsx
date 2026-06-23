'use client';

import { useState, useEffect } from 'react';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { TransactionHistory } from '@/components/dashboard/TransactionHistory';
import IncrementHistory from '@/components/dashboard/IncrementHistory';
import DailyTradeCard from '@/components/dashboard/DailyTradeCard';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BalanceStats {
  totalBalance: number;
  lockedAmount: number;
  availableBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalEarnings: number;
  referralEarnings: number;
  incrementEarnings: number;
}

interface Transaction {
  _id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  transactionId?: string;
  accountDetails?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function DashboardPage() {
  const [balanceStats, setBalanceStats] = useState<BalanceStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async (page: number = 1, newFilters = filters) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(newFilters.type && { type: newFilters.type }),
        ...(newFilters.status && { status: newFilters.status }),
        ...(newFilters.search && { search: newFilters.search }),
      });

      const response = await fetch(`/api/user/transactions?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Error',
        description: err.message || 'Failed to load transactions',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          fetch('/api/user/balance/stats'),
          fetch('/api/user/transactions'),
        ]);

        if (!balanceResponse.ok || !transactionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [balanceData, transactionsData] = await Promise.all([
          balanceResponse.json(),
          transactionsResponse.json(),
        ]);

        setBalanceStats(balanceData);
        setTransactions(transactionsData.transactions);
        setPagination(transactionsData.pagination);
      } catch (error: unknown) {
        const err = error as Error;
        toast({
          title: 'Error',
          description: err.message || 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  const handleFilterChange = (newFilters: { type?: string; status?: string; search?: string }) => {
    setFilters({ ...filters, ...newFilters });
    fetchTransactions(1, { ...filters, ...newFilters });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!balanceStats) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <Card>No data available</Card>
        </div>
      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="flex justify-between items-center">
          <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Dashboard</h1>
        </div>
        <div className="container mx-auto ">
          <div className="mb-8">
            <BalanceOverview {...balanceStats} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <TransactionHistory
              transactions={transactions}
              pagination={pagination}
              onPageChange={handlePageChange}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Live Trade Results</h2>
            <DailyTradeCard />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Daily Profit History</h2>
            <IncrementHistory />
          </div>
        </div>
      </div>
    </DashboardLayout>


  );
} 