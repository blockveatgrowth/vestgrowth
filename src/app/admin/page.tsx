import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpToLine, ArrowDownToLine, UsersIcon, ArrowUpFromLine, Calculator } from "lucide-react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { PendingTransactions } from "@/components/admin/PendingTransactions";
import { ActivityChart } from "@/components/admin/ActivityChart";
import RefreshButton from "@/components/admin/RefreshButton";
import ProcessIncrementsButton from "@/components/admin/ProcessIncrementsButton";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard overview for the Investo Boost platform",
};

export default async function AdminDashboardPage() {
  return (
    <div className="container py-8 px-4 md:px-8">
      <div className="mb-8 flex gap-4 flex-col-reverse md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of platform performance and metrics
          </p>
        </div>
        <div className="flex items-center  gap-2">
          <ProcessIncrementsButton />
          <RefreshButton />
        </div>
      </div>

      {/* Dynamic Dashboard Stats */}
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart - spans 2 columns */}
        <ActivityChart />

        {/* Pending Transactions */}
        <PendingTransactions />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="bg-muted/40">
                <CardContent className="p-4">
                  <a href="/admin/transactions/deposits" className="block">
                    <div className="flex flex-col items-center justify-center text-center h-24">
                      <ArrowDownToLine className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="text-sm font-medium">Manage Deposits</h3>
                    </div>
                  </a>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/40">
                <CardContent className="p-4">
                  <a href="/admin/transactions/withdrawals" className="block">
                    <div className="flex flex-col items-center justify-center text-center h-24">
                      <ArrowUpFromLine className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="text-sm font-medium">Manage Withdrawals</h3>
                    </div>
                  </a>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/40">
                <CardContent className="p-4">
                  <a href="/admin/users" className="block">
                    <div className="flex flex-col items-center justify-center text-center h-24">
                      <UsersIcon className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="text-sm font-medium">Manage Users</h3>
                    </div>
                  </a>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/40">
                <CardContent className="p-4">
                  <a href="/admin/support" className="block">
                    <div className="flex flex-col items-center justify-center text-center h-24">
                      <ArrowUpToLine className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="text-sm font-medium">Support Tickets</h3>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 