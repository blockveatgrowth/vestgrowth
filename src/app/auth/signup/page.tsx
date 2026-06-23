"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { useSession } from "next-auth/react";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // Get referral code from URL if present
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Step 1: Register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Step 2: Process referral if provided
      if (formData.referralCode) {
        try {
          const referralResponse = await fetch("/api/auth/process-referral", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: data.user.id,
              referralCode: formData.referralCode,
            }),
          });

          if (!referralResponse.ok) {
            const referralData = await referralResponse.json();
            console.error("Referral processing error:", referralData.error);
            // Don't throw error here, just log it as it's not critical
          }
        } catch (referralError) {
          console.error("Referral processing error:", referralError);
          // Don't throw error here, just log it as it's not critical
        }
      }
      
      toast.success("Account created successfully! Please sign in.");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0D1117] border border-[#FFD700]/20 rounded-2xl p-8 backdrop-blur-lg shadow-[0_0_15px_rgba(255,215,0,0.1)]">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <Image 
                  src="/images/logo.jpeg" 
                  alt="Investo Boost Logo" 
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold  mb-2 text-[#FFD700]">Investo Boost</h2>
            <h3 className="text-xl font-semibold text-[#FFD700] mb-1">Create Your Account</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div>
              <div className="text-gray-400 mb-2">Full Name</div>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
            </div>

            {/* Email Input */}
            <div>
              <div className="text-gray-400 mb-2">Email</div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="text-gray-400 mb-2">Password</div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="text-gray-400 mb-2">Confirm Password</div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
            </div>

            {/* Referral Code Input */}
            <div>
              <div className="text-gray-400 mb-2">Referral Code (Optional)</div>
              <Input
                id="referralCode"
                name="referralCode"
                type="text"
                placeholder="Enter referral code if you have one"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="w-4 h-4 rounded border-[#FFD700]/20 bg-black/20 text-[#FFD700] focus:ring-[#FFD700]/50"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link href="/terms" className="text-[#FFD700] hover:text-[#FFD700]/80">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#FFD700] hover:text-[#FFD700]/80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold py-2 rounded-md transition-colors"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Sign In Link */}
            <div className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link 
                href="/auth/signin" 
                className="text-[#FFD700] hover:text-[#FFD700]/80"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
} 