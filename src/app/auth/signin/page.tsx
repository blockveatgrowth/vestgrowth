"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const { status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [showMagicMode, setShowMagicMode] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  useEffect(() => {
    if (error) {
      toast.error(
        error === "CredentialsSignin" ? "Invalid email or password" : "An error occurred during sign in"
      );
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
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
        return;
      }
      toast.success("Welcome back!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail) { toast.error("Please enter your email"); return; }
    setIsMagicLoading(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: magicEmail }),
      });
      if (res.ok) {
        setMagicSent(true);
      } else {
        toast.error("Failed to send magic link. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsMagicLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#FFD700] text-sm font-medium">Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFD700]/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] inset-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="border border-[#FFD700]/20 rounded-2xl p-8 backdrop-blur-xl bg-[#0a0d18]/80 shadow-[0_0_60px_rgba(255,215,0,0.1)] animate-fade-in-up">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#FFD700]/30 shadow-[0_0_25px_rgba(255,215,0,0.25)]">
                <Image src="/images/logo.jpeg" alt="Investo Boost" fill style={{ objectFit: "contain" }} priority />
              </div>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Investo Boost
            </h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Magic Link Section */}
          {!showMagicMode ? (
            <button
              type="button"
              onClick={() => setShowMagicMode(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/30 text-white font-medium transition-all duration-200 mb-5"
            >
              <span className="text-lg">✨</span>
              Sign in with Magic Link
            </button>
          ) : magicSent ? (
            <div className="text-center py-4 mb-5 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-xl px-4">
              <div className="text-3xl mb-2">📬</div>
              <p className="text-white font-semibold text-sm mb-1">Check your inbox!</p>
              <p className="text-gray-400 text-xs">Magic link sent to <span className="text-[#FFD700]">{magicEmail}</span>. Expires in 15 min.</p>
              <button onClick={() => { setMagicSent(false); setShowMagicMode(false); setMagicEmail(""); }} className="text-[#FFD700] text-xs mt-2 hover:underline">Use password instead</button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="mb-5">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={magicEmail}
                  onChange={e => setMagicEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={isMagicLoading}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {isMagicLoading ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" /> : "Send ✨"}
                </button>
              </div>
              <button type="button" onClick={() => { setShowMagicMode(false); setMagicEmail(""); }} className="text-gray-500 text-xs mt-2 hover:text-gray-400">← Use password instead</button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-gray-600 text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/8 transition-all duration-200 text-sm"
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/8 transition-all duration-200 text-sm"
            />

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-[#FFD700]/70 hover:text-[#FFD700] text-xs transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#FFD700] hover:text-[#FFA500] font-bold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
