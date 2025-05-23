"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function DepositForm() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    transactionId: '',
    accountDetails: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.amount || parseFloat(formData.amount) < 30) {
      toast.error("Minimum deposit amount is 30");
      return;
    }
    
    if (!formData.transactionId) {
      toast.error("Please enter the transaction ID for verification");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          transactionId: formData.transactionId,
          accountDetails: formData.accountDetails,
          notes: formData.notes,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process deposit');
      }
      
      toast.success("Your deposit request has been submitted for approval");
      
      // Reset form
      setFormData({
        amount: '',
        transactionId: '',
        accountDetails: '',
        notes: '',
      });
      
      // Refresh the dashboard
      router.refresh();
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process deposit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Deposit Funds</CardTitle>
        <CardDescription>
          Add funds to your account. Minimum deposit amount is 30.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount (min. 30)"
              value={formData.amount}
              onChange={handleChange}
              min={30}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              name="transactionId"
              placeholder="Enter transaction ID for verification"
              value={formData.transactionId}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accountDetails">Account Details</Label>
            <Input
              id="accountDetails"
              name="accountDetails"
              placeholder="Enter your payment account details"
              value={formData.accountDetails}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional information"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit Deposit Request"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Deposits are subject to admin approval and will be processed within 24 hours.
      </CardFooter>
    </Card>
  );
} 