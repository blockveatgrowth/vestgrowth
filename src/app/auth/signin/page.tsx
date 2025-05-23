"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Show error from URL if present
  if (error) {
    toast.error(error === "CredentialsSignin" 
      ? "Invalid email or password" 
      : "An error occurred during sign in");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }
      
      toast.success("Successfully signed in!");
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please try again.");
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
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-[#FFD700] mb-2 ">Investo Boost</h2>
              <h3 className="text-xl font-semibold text-[#FFD700] mb-1">Sign In to Your Account</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
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
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold py-2 rounded-md transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                href="/auth/forgot-password" 
                className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/signup" 
                className="text-[#FFD700] hover:text-[#FFD700]/80"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
} 