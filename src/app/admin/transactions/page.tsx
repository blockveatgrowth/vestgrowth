'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionTable } from '@/components/admin/TransactionTable';
import { TransactionStats } from '@/components/admin/TransactionStats';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/components/ui/use-toast';

interface Transaction {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  rejectionReason?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TransactionStats {
  pending: {
    count: number;
    totalAmount: number;
  };
  approved: {
    count: number;
    totalAmount: number;
  };
  rejected: {
    count: number;
    totalAmount: number;
  };
}

export default function AdminTransactionsPage() {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [depositPagination, setDepositPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [withdrawalPagination, setWithdrawalPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [stats, setStats] = useState<{
    deposits: TransactionStats;
    withdrawals: TransactionStats;
  }>({
    deposits: {
      pending: { count: 0, totalAmount: 0 },
      approved: { count: 0, totalAmount: 0 },
      rejected: { count: 0, totalAmount: 0 },
    },
    withdrawals: {
      pending: { count: 0, totalAmount: 0 },
      approved: { count: 0, totalAmount: 0 },
      rejected: { count: 0, totalAmount: 0 },
    },
  });
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    userId: '',
  });
  const { toast } = useToast();

  const fetchTransactions = async (type: 'deposits' | 'withdrawals', page: number) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.userId && { userId: filters.userId }),
      });

      const response = await fetch(`/api/admin/transactions/${type}?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();
      if (type === 'deposits') {
        setDeposits(data.transactions);
        setDepositPagination(data.pagination);
      } else {
        setWithdrawals(data.transactions);
        setWithdrawalPagination(data.pagination);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    }
  };

  const fetchStats = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`/api/admin/transactions/stats?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transaction statistics',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = async (type: 'deposits' | 'withdrawals', id: string) => {
    try {
      const response = await fetch(`/api/admin/transactions/${type.slice(0, -1)}/${id}/approve`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve transaction');
      await fetchTransactions(type, type === 'deposits' ? depositPagination.page : withdrawalPagination.page);
      await fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve transaction',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (type: 'deposits' | 'withdrawals', id: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/transactions/${type.slice(0, -1)}/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to reject transaction');
      await fetchTransactions(type, type === 'deposits' ? depositPagination.page : withdrawalPagination.page);
      await fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject transaction',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchTransactions('deposits', 1),
        fetchTransactions('withdrawals', 1),
        fetchStats()
      ]);
    };
    loadData();
  }, [filters, fetchTransactions, fetchStats]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Transaction Management</h1>

      <div className="mb-6">
        <TransactionStats
          deposits={stats.deposits}
          withdrawals={stats.withdrawals}
          startDate={filters.startDate ? new Date(filters.startDate) : undefined}
          endDate={filters.endDate ? new Date(filters.endDate) : undefined}
        />
      </div>

      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Filter by User ID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          className="max-w-xs"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <DatePicker
          date={filters.startDate ? new Date(filters.startDate) : undefined}
          setDate={(date) =>
            setFilters({ ...filters, startDate: date ? date.toISOString() : '' })
          }
        />
        <DatePicker
          date={filters.endDate ? new Date(filters.endDate) : undefined}
          setDate={(date) =>
            setFilters({ ...filters, endDate: date ? date.toISOString() : '' })
          }
        />
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'deposits' | 'withdrawals')}>
        <TabsList>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>

        <TabsContent value="deposits">
          <TransactionTable
            transactions={deposits}
            type="deposit"
            onApprove={(id) => handleApprove('deposits', id)}
            onReject={(id, reason) => handleReject('deposits', id, reason)}
          />
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: depositPagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === depositPagination.page ? 'default' : 'outline'}
                onClick={() => fetchTransactions('deposits', page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="withdrawals">
          <TransactionTable
            transactions={withdrawals}
            type="withdraw"
            onApprove={(id) => handleApprove('withdrawals', id)}
            onReject={(id, reason) => handleReject('withdrawals', id, reason)}
          />
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: withdrawalPagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === withdrawalPagination.page ? 'default' : 'outline'}
                onClick={() => fetchTransactions('withdrawals', page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 