"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import MainLayout from "./MainLayout";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { status } = useSession();

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <MainLayout>
      <div className="relative min-h-screen px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>
        
        <div className="container py-8 relative z-10 mx-auto">
          <div className="grid gap-8">
            

            {status === "loading" ? (
              <Card className="border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                <CardContent className="py-10">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFD700] border-t-transparent" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
