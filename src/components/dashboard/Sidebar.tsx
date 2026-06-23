"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
  BarChart2,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const userNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownCircle },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpCircle },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
];

const adminNavigation = [
  { name: 'Overview', href: '/admin', icon: BarChart2 },
  { name: 'Users', href: '/admin/users', icon: UserCheck },
  { name: 'Deposits', href: '/admin/transactions/deposits', icon: ArrowDownCircle },
  { name: 'Withdrawals', href: '/admin/transactions/withdrawals', icon: ArrowUpCircle },
  { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
  { name: 'Trade Engine', href: '/admin/settings', icon: TrendingUp },
  { name: 'Wallets & Bonuses', href: '/admin/settings', icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <div className="flex flex-col h-full w-64 bg-[#0D1117]/80 backdrop-blur border-r border-[#FFD700]/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-[#FFD700]/10 relative z-10 gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-[0_0_12px_rgba(255,215,0,0.4)]">
          <TrendingUp className="w-4 h-4 text-black" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Investo Boost</h1>
      </div>

      {/* Admin badge */}
      {isAdmin && (
        <div className="mx-4 mt-3 px-3 py-1.5 rounded-md bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center gap-2 relative z-10">
          <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
          <span className="text-xs font-semibold text-[#FFD700]">Admin Control Panel</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name + item.href}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'text-gray-400 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:shadow-[0_0_10px_rgba(255,215,0,0.2)]'
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5 shrink-0", isActive ? "text-black" : "text-current")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#FFD700]/10 relative z-10">
        <p className="text-xs text-gray-600 text-center">
          {isAdmin ? 'Admin Control Panel v2.0' : 'Investo Boost v2.0'}
        </p>
      </div>
    </div>
  );
}