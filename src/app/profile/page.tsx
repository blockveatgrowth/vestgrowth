"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
  role: string;
  balance: number;
  totalDeposits: number;
  totalEarnings: number;
  avatar?: string | null;
  referralCode?: string | null;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className={`relative p-5 rounded-2xl border ${color} bg-[#0a0d18]/60 backdrop-blur overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none" />
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="w-2 h-2 rounded-full bg-[#FFD700]/40 animate-pulse" />
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then(r => r.json())
        .then(data => {
          setProfile(data);
          setAvatarPreview(data.avatar || null);
        })
        .catch(() => toast.error("Failed to load profile"))
        .finally(() => setIsLoading(false));
    }
  }, [status, router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setAvatarPreview(data.profileImage);
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyReferralCode = () => {
    if (!profile?.referralCode) return;
    const link = `${window.location.origin}/auth/signup?ref=${profile.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Loading profile...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  const initials = profile.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account and view your stats</p>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-[#FFD700]/20 bg-[#0a0d18]/80 backdrop-blur-xl shadow-[0_0_60px_rgba(255,215,0,0.06)] p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#FFD700]/30 shadow-[0_0_25px_rgba(255,215,0,0.2)]">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 flex items-center justify-center">
                    <span className="text-3xl font-black text-[#FFD700]">{initials}</span>
                  </div>
                )}
              </div>

              {/* Upload overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              {/* Upload hint */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-3.5 h-3.5">
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                  <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-white">{profile.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  profile.role === "admin"
                    ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                    : "bg-white/5 text-gray-400 border border-white/10"
                }`}>
                  {profile.role}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{profile.email}</p>
              <p className="text-gray-600 text-xs">
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => router.push("/profile/edit")}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#FFD700]/25 text-[#FFD700] text-sm font-semibold hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Balance"
            value={`$${profile.balance.toFixed(2)}`}
            icon="💎"
            color="border-[#FFD700]/20"
          />
          <StatCard
            label="Total Deposited"
            value={`$${profile.totalDeposits.toFixed(2)}`}
            icon="📥"
            color="border-blue-500/20"
          />
          <StatCard
            label="Total Earnings"
            value={`$${profile.totalEarnings.toFixed(2)}`}
            icon="📈"
            color="border-green-500/20"
          />
          <StatCard
            label="Net Profit"
            value={`$${Math.max(0, profile.totalEarnings - profile.totalDeposits + profile.balance).toFixed(2)}`}
            icon="🏆"
            color="border-purple-500/20"
          />
        </div>

        {/* Referral code card */}
        {profile.referralCode && (
          <div className="rounded-2xl border border-[#FFD700]/20 bg-gradient-to-br from-[#FFD700]/5 to-transparent p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFD700" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">Your Referral Link</h3>
                <p className="text-gray-500 text-xs">Share this link to earn commissions on every deposit</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-[#FFD700] truncate">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/auth/signup?ref=${profile.referralCode}`
                  : `/auth/signup?ref=${profile.referralCode}`}
              </div>
              <button
                onClick={copyReferralCode}
                className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  copied
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-[#FFD700]/10 border border-[#FFD700]/25 text-[#FFD700] hover:bg-[#FFD700]/20"
                }`}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-gray-600 text-xs">Your code:</span>
              <span className="px-2 py-0.5 rounded-md bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs font-mono font-bold">
                {profile.referralCode}
              </span>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="rounded-2xl border border-white/8 bg-[#0a0d18]/60 p-6">
          <h3 className="text-white font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Deposit", href: "/dashboard/deposit", icon: "📥", color: "border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5" },
              { label: "Withdraw", href: "/dashboard/withdraw", icon: "📤", color: "border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5" },
              { label: "Referrals", href: "/dashboard/referrals", icon: "👥", color: "border-[#FFD700]/20 hover:border-[#FFD700]/40 hover:bg-[#FFD700]/5" },
              { label: "Dashboard", href: "/dashboard", icon: "📊", color: "border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5" },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${action.color} transition-all duration-200 text-center`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-gray-300 text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
