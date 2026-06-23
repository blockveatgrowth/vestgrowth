"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function MagicSignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setErrorMsg("Invalid or missing magic link parameters.");
      return;
    }

    const doSignIn = async () => {
      try {
        const result = await signIn("magic-token", {
          redirect: false,
          token,
          email: decodeURIComponent(email),
        });

        if (result?.error) {
          setStatus("error");
          setErrorMsg("This magic link has expired or already been used. Please request a new one.");
        } else {
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      } catch {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    };

    doSignIn();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFD700]/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] inset-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="border border-[#FFD700]/20 rounded-2xl p-8 backdrop-blur-xl bg-[#0a0d18]/80 shadow-[0_0_60px_rgba(255,215,0,0.1)] animate-fade-in-up text-center">

          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center mx-auto mb-5">
                <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2">Verifying Magic Link</h1>
              <p className="text-gray-400 text-sm">Please wait while we sign you in securely...</p>
              <div className="mt-6 flex justify-center gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#FFD700]/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-white mb-2">Welcome Back!</h1>
              <p className="text-gray-400 text-sm mb-6">You&apos;ve been signed in successfully. Redirecting to your dashboard...</p>
              <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto" />
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-white mb-2">Link Expired</h1>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{errorMsg}</p>
              <div className="space-y-3">
                <Link href="/auth/signin" className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-[1.02] text-sm">
                  Request New Magic Link
                </Link>
                <Link href="/auth/signin" className="inline-flex items-center justify-center w-full py-3 px-4 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 text-sm">
                  Sign in with password
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">Investo Boost — Secure Investment Platform</p>
      </div>
    </div>
  );
}

export default function MagicSignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MagicSignInContent />
    </Suspense>
  );
}
