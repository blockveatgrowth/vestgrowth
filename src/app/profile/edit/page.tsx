"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch current user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password fields if attempting to change password
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      
      if (formData.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters long");
        return;
      }
      
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      
      // Update session with new name if changed
      if (formData.name !== session?.user?.name) {
        await update();
      }
      
      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 bg-black/20 border-[#FFD700]/20">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-400">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-400">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
              />
            </div>

            {/* Password Change Section */}
            <div className="pt-6 border-t border-[#FFD700]/20">
              <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
              
              {/* Current Password */}
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-400">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2 mt-4">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-400">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2 mt-4">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-400">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-black/20 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/50"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
                className="border-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 