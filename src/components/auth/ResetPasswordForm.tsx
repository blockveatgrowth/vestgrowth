"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
      
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/auth/signin"), 2500);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-400", "bg-green-500"][strength];

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFD700]/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] inset-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="border border-[#FFD700]/20 rounded-2xl p-8 backdrop-blur-xl bg-[#0a0d18]/80 shadow-[0_0_60px_rgba(255,215,0,0.1)] animate-fade-in-up">

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Password Reset!</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Your password has been successfully updated. Redirecting you to sign in...
              </p>
              <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-7">
                <div className="w-14 h-14 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#FFD700]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black text-white">Create New Password</h1>
                <p className="text-gray-400 text-sm mt-1">Choose a strong password for your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/8 transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-white/10"}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${strength >= 3 ? "text-green-400" : strength === 2 ? "text-yellow-400" : "text-red-400"}`}>
                      {strengthLabel} password
                    </p>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white/5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-200 text-sm ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? "border-red-500/50 focus:border-red-500/70"
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? "border-green-500/50 focus:border-green-500/70"
                        : "border-white/10 focus:border-[#FFD700]/50 focus:bg-white/8"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs">Passwords do not match</p>
                )}

                {/* Requirements */}
                <div className="bg-white/3 border border-white/8 rounded-xl p-3 space-y-1.5">
                  <p className="text-xs text-gray-500 font-medium mb-2">Password requirements:</p>
                  {[
                    { check: formData.password.length >= 8, label: "At least 8 characters" },
                    { check: /[A-Z]/.test(formData.password), label: "One uppercase letter" },
                    { check: /[0-9]/.test(formData.password), label: "One number" },
                  ].map(req => (
                    <div key={req.label} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${req.check ? "bg-green-500/20 border border-green-500/40" : "bg-white/5 border border-white/10"}`}>
                        {req.check && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2 text-green-400">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs ${req.check ? "text-green-400" : "text-gray-500"}`}>{req.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.password !== formData.confirmPassword || formData.password.length < 8}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Resetting...
                    </span>
                  ) : "Set New Password →"}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-5">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-[#FFD700] hover:text-[#FFA500] font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
