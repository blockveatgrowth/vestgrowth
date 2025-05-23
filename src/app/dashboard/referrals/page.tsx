"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clipboard, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface ReferralStats {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  totalEarnings: number;
  directReferrals: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }[];
  referralsByLevel: {
    counts: number[];
    earnings: number[];
  };
}

export default function ReferralsPage() {
  const { status } = useSession();
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await fetch("/api/referrals");
        if (!response.ok) {
          throw new Error("Failed to fetch referral data");
        }
        const data = await response.json();
        setReferralStats(data);
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast.error("Failed to load referral data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchReferralData();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const copyReferralLink = () => {
    if (!referralStats) return;
    
    navigator.clipboard.writeText(referralStats.referralLink)
      .then(() => {
        setCopiedLink(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link. Please try manually selecting and copying.");
      });
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (status === "unauthenticated") {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <Card>
            <CardContent className="py-10 px-6">
              <p className="text-xl text-center">Please log in to view your referrals</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Referral Program</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with friends and earn commissions when they deposit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 bg-muted p-3 rounded-md overflow-hidden overflow-ellipsis">
                <p className="text-sm break-all">
                  {referralStats?.referralLink || "Loading..."}
                </p>
              </div>
              <Button 
                onClick={copyReferralLink}
                className="whitespace-nowrap"
                disabled={!referralStats || copiedLink}
              >
                {copiedLink ? "Copied!" : "Copy Link"} <Clipboard className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Your Referral Code</p>
                  <h3 className="text-2xl font-bold mt-1">{referralStats?.referralCode || "-"}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <h3 className="text-2xl font-bold mt-1">{referralStats?.referralCount || 0}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <h3 className="text-2xl font-bold mt-1">${referralStats?.totalEarnings.toFixed(2) || "0.00"}</h3>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="earnings">Earnings by Level</TabsTrigger>
            <TabsTrigger value="referrals">Your Referrals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Commission Structure</CardTitle>
                <CardDescription>
                  Earn different commission percentages based on the referral level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Referrals</TableHead>
                      <TableHead className="text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Level 1 (Direct)</TableCell>
                      <TableCell>10%</TableCell>
                      <TableCell>{referralStats?.referralsByLevel.counts[0] || 0}</TableCell>
                      <TableCell className="text-right">${referralStats?.referralsByLevel.earnings[0]?.toFixed(2) || "0.00"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Level 2</TableCell>
                      <TableCell>5%</TableCell>
                      <TableCell>{referralStats?.referralsByLevel.counts[1] || 0}</TableCell>
                      <TableCell className="text-right">${referralStats?.referralsByLevel.earnings[1]?.toFixed(2) || "0.00"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Level 3</TableCell>
                      <TableCell>2.5%</TableCell>
                      <TableCell>{referralStats?.referralsByLevel.counts[2] || 0}</TableCell>
                      <TableCell className="text-right">${referralStats?.referralsByLevel.earnings[2]?.toFixed(2) || "0.00"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Level 4</TableCell>
                      <TableCell>1.25%</TableCell>
                      <TableCell>{referralStats?.referralsByLevel.counts[3] || 0}</TableCell>
                      <TableCell className="text-right">${referralStats?.referralsByLevel.earnings[3]?.toFixed(2) || "0.00"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Level 5</TableCell>
                      <TableCell>0.75%</TableCell>
                      <TableCell>{referralStats?.referralsByLevel.counts[4] || 0}</TableCell>
                      <TableCell className="text-right">${referralStats?.referralsByLevel.earnings[4]?.toFixed(2) || "0.00"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Your Direct Referrals</CardTitle>
                <CardDescription>
                  Users who registered using your referral link
                </CardDescription>
              </CardHeader>
              <CardContent>
                {referralStats?.directReferrals && referralStats.directReferrals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referralStats.directReferrals.map((referral) => (
                        <TableRow key={referral._id}>
                          <TableCell>{referral.name}</TableCell>
                          <TableCell>{referral.email}</TableCell>
                          <TableCell>
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      You don&apos;t have any direct referrals yet. Share your referral link to start earning!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-2">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Share your unique referral link with friends and on social media.</li>
              <li>When someone signs up using your link, they become your direct referral (Level 1).</li>
              <li>You&apos;ll earn 10% commission on all their approved deposits.</li>
              <li>If your referrals invite others, you&apos;ll earn commissions up to 5 levels deep.</li>
              <li>Commissions are automatically added to your balance when deposits are approved.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 