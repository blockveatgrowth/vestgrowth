"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  ArrowUpDown,
  Activity,
  LifeBuoy,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ArrowDown,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in or not admin, redirect to signin
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (status === "authenticated" && session?.user?.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const navigation = [
    { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Deposits", href: "/admin/transactions/deposits", icon: ArrowUpDown },
    { name: "Withdrawals", href: "/admin/transactions/withdrawals", icon: ArrowDown },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Platform Settings", href: "/admin/settings", icon: Settings },
    { name: "User Dashboard", href: "/dashboard", icon: TrendingUp },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex h-screen bg-[#0D1117]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-[#161B22] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen border-r border-[#30363d]`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#30363d]">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src="/images/logo.jpeg" 
                alt="Investo Boost Logo" 
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Investo Boost</span>
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-2">
          {navigation.map((item) =>
            (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-[#FFD700]/10 text-[#FFD700]"
                    : "text-gray-400 hover:bg-[#30363d] hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-[#30363d]">
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
              <span className="text-[#FFD700]">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-[#30363d] text-gray-400 hover:bg-[#30363d] hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-16 w-full flex items-center justify-between px-4 border-b border-[#30363d] bg-[#0D1117]">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
            <div className="ml-4 lg:hidden">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src="/images/logo.jpeg" 
                    alt="Investo Boost Logo" 
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Investo Boost</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* Admin quick actions could go here */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0D1117] p-4">
          {children}
          <Toaster position="bottom-right" />
        </main>
      </div>
    </div>
  );
} 