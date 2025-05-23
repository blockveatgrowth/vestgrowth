"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownCircle },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpCircle },
  { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-64 bg-[#0D1117]/80 backdrop-blur border-r border-[#FFD700]/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent pointer-events-none" />
      
      <div className="flex h-16 items-center px-4 border-b border-[#FFD700]/10 relative z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Investo Boost</h1>
      </div>
      
      <nav className="flex-1 space-y-1 p-4 relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300',
                isActive
                  ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'text-gray-400 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:shadow-[0_0_10px_rgba(255,215,0,0.2)]'
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-black" : "text-current")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 