"use client";

import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#0D1117]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/3 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>
        {children}
      </main>
    </div>
  );
} 