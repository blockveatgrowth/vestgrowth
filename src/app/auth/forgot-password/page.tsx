"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetData, setResetData] = useState<{ resetToken: string; resetUrl: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }
      
      setResetData({
        resetToken: data.resetToken,
        resetUrl: data.resetUrl,
      });
      toast.success("Password reset token generated successfully");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (resetData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full space-y-8 p-6 bg-black/20 rounded-lg border border-[#FFD700]/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">Reset Your Password</h2>
            <p className="text-gray-400 mb-4">
              Here is your password reset information:
            </p>
            <div className="bg-black/40 p-4 rounded-lg mb-4 text-left">
              <p className="text-sm text-gray-400 mb-2">Reset URL:</p>
              <p className="text-white break-all font-mono mb-4">{resetData.resetUrl}</p>
              <p className="text-sm text-gray-400 mb-2">Reset Token:</p>
              <p className="text-white break-all font-mono">{resetData.resetToken}</p>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => router.push(resetData.resetUrl)}
                className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
              >
                Continue to Reset Password
              </Button>
              <Link
                href="/auth/signin"
                className="text-[#FFD700] hover:text-[#FFD700]/80 block"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-6 bg-black/20 rounded-lg border border-[#FFD700]/20">
        <div>
          <h2 className="text-2xl font-bold text-center text-[#FFD700]">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Enter your email address to receive a password reset token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold py-2 rounded-md transition-colors"
            >
              {isLoading ? "Processing..." : "Get Reset Token"}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 