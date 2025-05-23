"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  name: string;
  href: string;
}

const publicNavigation: NavigationItem[] = [
 
];

const userNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Deposit", href: "/dashboard/deposit" },
  { name: "Withdraw", href: "/dashboard/withdraw" },
  { name: "Referrals", href: "/dashboard/referrals" },
];

const adminNavigation: NavigationItem[] = [
  { name: "Admin", href: "/admin" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  ...userNavigation,
];

const legalLinks: NavigationItem[] = [
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  
  // Select navigation based on user role
  const navigation = isAuthenticated 
    ? isAdmin 
      ? adminNavigation 
      : userNavigation
    : publicNavigation;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-[#0D1117] backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/60 sticky top-0 z-40 w-full border-b border-[#FFD700]/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image 
                src="/images/logo.jpeg" 
                alt="Investo Boost Logo" 
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            {/* <span className="font-bold text-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Investo Boost</span> */}
          </Link>

          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#FFD700]",
                  pathname === item.href
                    ? "text-[#FFD700]"
                    : "text-gray-400"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="relative group">
              <button className="text-sm font-medium text-gray-400 hover:text-[#FFD700] flex items-center gap-1">
                Legal
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-[#0D1117] border border-[#FFD700]/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {legalLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-400">
                {session.user?.name || "User"}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-400 hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button 
                  size="sm"
                  className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#FFD700]/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111827] border-b border-[#FFD700]/20 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "text-[#FFD700] bg-[#FFD700]/10"
                    : "text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-[#FFD700]/10 pt-2 mt-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Legal
              </p>
              {legalLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 