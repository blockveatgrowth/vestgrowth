"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Menu, ChevronDown, X, User, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface NavigationItem {
  name: string;
  href: string;
}

const publicNavigation: NavigationItem[] = [];

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const navigation = isAuthenticated
    ? isAdmin ? adminNavigation : userNavigation
    : publicNavigation;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const userInitials = session?.user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="bg-[#0D1117]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0D1117]/80 sticky top-0 z-40 w-full border-b border-[#FFD700]/15">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2.5">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#FFD700]/30">
              <Image
                src="/images/logo.jpeg"
                alt="Investo Boost Logo"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <span className="hidden sm:block font-black text-base bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Investo Boost
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#FFD700]",
                  pathname === item.href ? "text-[#FFD700]" : "text-gray-400"
                )}
              >
                {item.name}
              </Link>
            ))}

            <div className="relative group">
              <button className="text-sm font-medium text-gray-400 hover:text-[#FFD700] flex items-center gap-1">
                Legal <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-[#0D1117] border border-[#FFD700]/20 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                {legalLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/8 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* User avatar dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#FFD700]/30 bg-[#FFD700]/10 flex items-center justify-center shrink-0">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#FFD700] text-xs font-black">{userInitials}</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm text-gray-300 font-medium max-w-[100px] truncate">
                    {session.user?.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#0a0d18] border border-[#FFD700]/20 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-white text-sm font-bold truncate">{session.user?.name}</p>
                      <p className="text-gray-500 text-xs truncate">{session.user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/profile/edit"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </Link>
                    </div>
                    <div className="border-t border-white/5 py-1">
                      <button
                        onClick={() => { setUserMenuOpen(false); handleSignOut(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:opacity-90 font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-[#FFD700]/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d18] border-b border-[#FFD700]/15 animate-fade-in-down">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-[#FFD700] bg-[#FFD700]/10"
                    : "text-gray-400 hover:text-[#FFD700] hover:bg-[#FFD700]/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <div className="border-t border-white/5 pt-2 mt-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}

            <div className="border-t border-white/5 pt-2 mt-2">
              <p className="px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">Legal</p>
              {legalLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/3 transition-colors"
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
