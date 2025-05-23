"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
  role: string;
  balance: number;
  totalDeposits: number;
  totalEarnings: number;
  avatar?: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-[#FFD700]/10 text-[#FFD700] text-2xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-gray-400">{profile.email}</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/profile/edit")}
            variant="outline"
            className="border-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/10"
          >
            Edit Profile
          </Button>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-black/20 border-[#FFD700]/20">
            <h3 className="text-gray-400 mb-2">Total Balance</h3>
            <p className="text-2xl font-bold text-white">${profile.balance.toFixed(2)}</p>
          </Card>
          <Card className="p-6 bg-black/20 border-[#FFD700]/20">
            <h3 className="text-gray-400 mb-2">Total Deposits</h3>
            <p className="text-2xl font-bold text-white">${profile.totalDeposits.toFixed(2)}</p>
          </Card>
          <Card className="p-6 bg-black/20 border-[#FFD700]/20">
            <h3 className="text-gray-400 mb-2">Total Earnings</h3>
            <p className="text-2xl font-bold text-white">${profile.totalEarnings.toFixed(2)}</p>
          </Card>
        </div>

        {/* Account Details */}
        <Card className="p-6 bg-black/20 border-[#FFD700]/20">
          <h2 className="text-xl font-semibold text-white mb-4">Account Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Member Since</span>
              <span className="text-white">{formatDate(profile.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Account Type</span>
              <span className="text-white capitalize">{profile.role}</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-black/20 border-[#FFD700]/20">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push("/deposit")}
              className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              Make a Deposit
            </Button>
            <Button
              onClick={() => router.push("/withdraw")}
              variant="outline"
              className="border-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/10"
            >
              Withdraw Funds
            </Button>
            <Button
              onClick={() => router.push("/referrals")}
              variant="outline"
              className="border-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/10"
            >
              View Referrals
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
} 