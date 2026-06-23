import { DollarSign, Lock, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Wallet } from 'lucide-react';
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

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  highlight?: boolean;
  color?: string;
}

function StatCard({ title, value, sub, icon, highlight, color = "border-white/8" }: StatCardProps) {
  return (
    <div className={`relative p-5 rounded-2xl border ${highlight ? "border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/8 to-transparent shadow-[0_0_30px_rgba(255,215,0,0.08)]" : `${color} bg-[#0a0d18]/60`} backdrop-blur overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none" />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? "bg-[#FFD700]/15 border border-[#FFD700]/25" : "bg-white/5 border border-white/8"}`}>
          {icon}
        </div>
        <div className={`w-2 h-2 rounded-full ${highlight ? "bg-[#FFD700]" : "bg-white/20"} animate-pulse`} />
      </div>
      <div className={`text-2xl font-black mb-1 ${highlight ? "text-[#FFD700]" : "text-white"}`}>{value}</div>
      <div className="text-gray-400 text-sm font-medium mb-0.5">{title}</div>
      <div className="text-gray-600 text-xs">{sub}</div>
    </div>
  );
}

export function BalanceOverview({
  totalBalance,
  lockedAmount,
  availableBalance,
  totalDeposits,
  totalWithdrawals,
  totalEarnings,
  referralEarnings,
}: BalanceOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Primary balance cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          sub="All deposits + earnings"
          icon={<DollarSign className="h-5 w-5 text-[#FFD700]" />}
          highlight
        />
        <StatCard
          title="Available to Withdraw"
          value={formatCurrency(availableBalance)}
          sub="Ready for withdrawal"
          icon={<Wallet className="h-5 w-5 text-green-400" />}
          color="border-green-500/15"
        />
        <StatCard
          title="Locked Amount"
          value={formatCurrency(lockedAmount)}
          sub="Minimum required balance"
          icon={<Lock className="h-5 w-5 text-yellow-400" />}
          color="border-yellow-500/15"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Deposited"
          value={formatCurrency(totalDeposits)}
          sub="All approved deposits"
          icon={<ArrowDownToLine className="h-4 w-4 text-blue-400" />}
          color="border-blue-500/15"
        />
        <StatCard
          title="Total Withdrawn"
          value={formatCurrency(totalWithdrawals)}
          sub="All approved withdrawals"
          icon={<ArrowUpFromLine className="h-4 w-4 text-purple-400" />}
          color="border-purple-500/15"
        />
        <StatCard
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
          sub="Daily profit + referrals"
          icon={<TrendingUp className="h-4 w-4 text-green-400" />}
          color="border-green-500/15"
        />
        <StatCard
          title="Referral Earnings"
          value={formatCurrency(referralEarnings)}
          sub="From your network"
          icon={<TrendingUp className="h-4 w-4 text-[#FFD700]" />}
          color="border-[#FFD700]/15"
        />
      </div>
    </div>
  );
}
