"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function WithdrawForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    accountDetails: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }
    
    if (!formData.accountDetails) {
      toast.error("Please enter your account details for the withdrawal");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          accountDetails: formData.accountDetails,
          notes: formData.notes,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process withdrawal');
      }
      
      toast.success("Your withdrawal request has been submitted for approval");
      
      // Reset form
      setFormData({
        amount: '',
        accountDetails: '',
        notes: '',
      });
      
      // Refresh the dashboard
      router.refresh();
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
        <CardDescription>
          Submit a withdrawal request for processing. Requests are typically processed within 24-48 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Note: A minimum balance of 300 must be maintained in your account.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="accountDetails">Account Details</Label>
              <Textarea
                id="accountDetails"
                name="accountDetails"
                placeholder="Enter your wallet address or bank account details"
                value={formData.accountDetails}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Please provide complete and accurate account information for processing your withdrawal.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit Withdrawal Request"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Withdrawals are subject to admin approval and will be processed within 24-48 hours.
      </CardFooter>
    </Card>
  );
} 