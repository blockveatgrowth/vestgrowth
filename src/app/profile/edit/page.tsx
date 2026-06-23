"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then(r => r.json())
      .then(data => {
        setFormData(prev => ({ ...prev, name: data.name, email: data.email }));
        setAvatarPreview(data.avatar || null);
      })
      .catch(() => toast.error("Failed to load profile data"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }

    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/user/upload-avatar", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setAvatarPreview(data.profileImage);
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        return;
      }
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      if (formData.name !== session?.user?.name) await update();

      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const initials = formData.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">

        <div className="mb-8">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Profile
          </button>
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">Update your personal information and password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Avatar section */}
          <div className="rounded-2xl border border-[#FFD700]/20 bg-[#0a0d18]/80 backdrop-blur-xl p-6">
            <h2 className="text-white font-bold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-[#FFD700]/30">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 flex items-center justify-center">
                      <span className="text-2xl font-black text-[#FFD700]">{initials}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  )}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl border border-[#FFD700]/25 text-[#FFD700] text-sm font-semibold hover:bg-[#FFD700]/10 transition-all duration-200 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Change Photo"}
                </button>
                <p className="text-gray-600 text-xs mt-2">JPG, PNG or GIF · Max 2MB</p>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18]/80 backdrop-blur-xl p-6 space-y-4">
            <h2 className="text-white font-bold">Personal Information</h2>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-sm font-medium">Full Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-sm font-medium">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password change */}
          <div className="rounded-2xl border border-white/8 bg-[#0a0d18]/80 backdrop-blur-xl p-6 space-y-4">
            <div>
              <h2 className="text-white font-bold">Change Password</h2>
              <p className="text-gray-500 text-xs mt-0.5">Leave blank to keep your current password</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-sm font-medium">Current Password</label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showCurrentPw ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={showCurrentPw ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 text-sm font-medium">New Password</label>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showNewPw ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={showNewPw ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 text-sm font-medium">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 rounded-xl border bg-white/5 text-white placeholder:text-gray-500 focus:outline-none transition-all text-sm ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-[#FFD700]/50"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-gray-400 font-semibold text-sm hover:bg-white/5 hover:border-white/20 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-black rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : "Save Changes →"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
