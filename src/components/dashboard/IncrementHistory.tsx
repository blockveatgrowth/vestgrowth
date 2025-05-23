"use client";

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ReferrerEarning {
  referrerId: string;
  amount: number;
  level: number;
}

interface Profit {
  _id: string;
  amount: number;
  referrerEarnings: ReferrerEarning[] | number;
  date: string;
  profitType: 'daily' | 'referral' | 'welcome';
}

export default function IncrementHistory() {
  const [profits, setProfits] = useState<Profit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfits = async () => {
      try {
        const response = await fetch('/api/user/increments');
        if (!response.ok) {
          throw new Error('Failed to fetch profits');
        }
        const data = await response.json();
        setProfits(data.increments || []);
      } catch (error) {
        console.error('Error fetching profits:', error);
        setProfits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfits();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profits || profits.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No increment history available
      </div>
    );
  }

  const getProfitTypeDisplay = (type: string) => {
    switch (type) {
      case 'daily':
        return 'Daily';
      case 'referral':
        return 'Referral';
      case 'welcome':
        return 'Welcome';
      default:
        return type;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500/10 text-blue-300';
      case 'referral':
        return 'bg-green-500/10 text-green-300';
      case 'welcome':
        return 'bg-[#8B5CF6]/10 text-[#C4B5FD]';
      default:
        return 'bg-gray-500/10 text-gray-300';
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Daily Profit History</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-white/60">Date</TableHead>
              <TableHead className="text-white/60">Type</TableHead>
              <TableHead className="text-white/60 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profits.map((profit) => (
              <TableRow key={profit._id} className="border-white/10">
                <TableCell className="text-white/80">
                  {format(new Date(profit.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getTypeStyles(profit.profitType)}`}>
                    {getProfitTypeDisplay(profit.profitType)}
                  </span>
                </TableCell>
                <TableCell className="text-right text-white/80">
                  ${profit.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 