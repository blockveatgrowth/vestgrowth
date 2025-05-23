import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AdminLayout from "@/components/AdminLayout";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const metadata: Metadata = {
  title: "Admin Panel | Investo Boost",
  description: "Admin dashboard for Investo Boost platform",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and has admin role
  if (!session || !session.user || session.user.role !== "admin") {
    // Redirect to login if not authenticated or not an admin
    redirect("/auth/signin");
  }
  
  return <AdminLayout>{children}</AdminLayout>;
} 