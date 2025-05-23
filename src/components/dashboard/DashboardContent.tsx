"use client";

import IncrementHistory from './IncrementHistory';
import {BalanceOverview} from './BalanceOverview';

export function DashboardContent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-8">
        <BalanceOverview totalBalance={0} lockedAmount={0} availableBalance={0} totalDeposits={0} totalWithdrawals={0} totalEarnings={0} referralEarnings={0} incrementEarnings={0} />
        <IncrementHistory />
      </div>
    </div>
  );
} 