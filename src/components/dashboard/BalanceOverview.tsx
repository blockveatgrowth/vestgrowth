import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Lock, ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BalanceOverviewProps {
  totalBalance: number;
  lockedAmount: number;
  availableBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalEarnings: number;
  referralEarnings: number;
  incrementEarnings: number;
}

export function BalanceOverview({
  totalBalance,
  lockedAmount,
  availableBalance,
  totalDeposits,
  totalWithdrawals,
  totalEarnings,
  referralEarnings,
  incrementEarnings,
}: BalanceOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md  md:text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Includes all deposits, earnings, and withdrawals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Amount</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md md:text-2xl font-bold">{formatCurrency(lockedAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum required balance for withdrawals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md md:text-2xl font-bold">{formatCurrency(availableBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Amount available for withdrawal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md md:text-2xl font-bold">{formatCurrency(totalDeposits)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All approved deposits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md md:text-2xl font-bold">{formatCurrency(totalWithdrawals)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All approved withdrawals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md md:text-2xl font-bold">{formatCurrency(referralEarnings)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Earnings from referrals
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md md:text-2xl font-bold">{formatCurrency(incrementEarnings)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Earnings from daily increments
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
} 