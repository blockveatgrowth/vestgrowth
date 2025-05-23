"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from '@/components/ui/copy-button';
import { Loader2 } from 'lucide-react';

// Bank options data - static for now
const bankOptions = [
  { id: 'bank1', name: 'TRC20', accountId: 'TCcDEhikqzaHpSp2HubiksS2tPm188PKUt' },
  { id: 'bank2', name: 'ERC20', accountId: '0x8282a8a8f68f12c8cc2a9592a6585878e71cb039' },
  { id: 'bank3', name: 'BEP20', accountId: '0x4b47b65b4d19249930e30d4a9c18751f9b3dc8f1' },
];

// Plan type for TypeScript
interface Plan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  directCommissionPercentage: number;
}

const formSchema = z.object({
  bankId: z.string().min(1, 'Please select a bank'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  amount: z.coerce.number().min(30, 'Minimum deposit amount is $30'),
  planId: z.string().min(1, 'Please select a plan'),
});

export function DepositForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<typeof bankOptions[0] | null>(bankOptions[0]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        setPlans(data.plans);
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Failed to load investment plans');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankId: bankOptions[0].id,
      transactionId: '',
      amount: 30,
      planId: '',
    },
  });

  const handleBankChange = (value: string) => {
    const bank = bankOptions.find(bank => bank.id === value);
    setSelectedBank(bank || null);
  };

  const handlePlanChange = (value: string) => {
    const plan = plans.find(plan => plan.id === value);
    setSelectedPlan(plan || null);
    
    if (plan) {
      form.setValue('amount', plan.minAmount);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit deposit request');
      }

      toast.success('Deposit request submitted successfully');
      router.refresh();
      form.reset();
      setSelectedBank(null);
      setSelectedPlan(null);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit deposit request';
      toast.error(errorMessage);
      console.error('Error submitting deposit:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
        <span className="ml-2 text-gray-400">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent animate-pulse-slow pointer-events-none" />
      <Card className="max-w-2xl border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/60 shadow-[0_0_20px_rgba(255,215,0,0.1)] relative overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x" />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent animate-fade-in-up">Deposit Funds</CardTitle>
          <CardDescription className="text-gray-400 animate-fade-in-up delay-100">
            Select a bank, make your payment, then enter transaction details to complete your deposit. Minimum deposit amount is $50.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bankId"
                render={({ field }) => (
                  <FormItem className="animate-fade-in-up delay-200">
                    <FormLabel className="text-gray-300">Select Network</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleBankChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 transition-all duration-300">
                          <SelectValue placeholder="Select a Network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0D1117] border-[#FFD700]/20">
                        {bankOptions.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id} aria-selected={selectedBank?.id === bank.id} className="hover:bg-[#FFD700]/10 focus:bg-[#FFD700]/10">
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {selectedBank && (
                <div className="p-4 border rounded-md border-[#FFD700]/30 bg-[#0D1117]/80 shadow-[0_0_15px_rgba(255,215,0,0.15)] animate-fade-in">
                  <p className="text-sm font-medium mb-2 text-[#FFD700]">Account Details</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300">Account ID: <span className="text-white">{selectedBank.accountId}</span></p>
                    <CopyButton value={selectedBank.accountId} className="text-[#FFD700] hover:bg-[#FFD700]/10" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Send your payment to this account and copy the transaction ID below.
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="planId"
                render={({ field }) => (
                  <FormItem className="animate-fade-in-up delay-300">
                    <FormLabel className="text-gray-300">Select Plan</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handlePlanChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 transition-all duration-300">
                          <SelectValue placeholder="Select an investment plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0D1117] border-[#FFD700]/20">
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id} className="hover:bg-[#FFD700]/10 focus:bg-[#FFD700]/10">
                            {plan.name} (${plan.minAmount} - ${plan.maxAmount})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {selectedPlan && (
                <div className="p-4 border rounded-md border-[#FFD700]/30 bg-[#0D1117]/80 shadow-[0_0_15px_rgba(255,215,0,0.15)] animate-fade-in">
                  <p className="text-sm font-medium mb-2 text-[#FFD700]">Plan Details</p>
                  <p className="text-sm text-gray-300">Minimum Amount: <span className="text-white">${selectedPlan.minAmount}</span></p>
                  <p className="text-sm text-gray-300">Maximum Amount: <span className="text-white">${selectedPlan.maxAmount}</span></p>
                  <p className="text-sm text-gray-300">Direct Commission: <span className="text-white">{selectedPlan.directCommissionPercentage}%</span></p>
                  <p className="text-xs text-gray-400 mt-2">
                    Please enter an amount within the plan&apos;s range.
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem className="animate-fade-in-up delay-400">
                    <FormLabel className="text-gray-300">Transaction ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your transaction ID" {...field} className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 focus:border-[#FFD700]/60 focus:ring-[#FFD700]/20 transition-all duration-300" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="animate-fade-in-up delay-500">
                    <FormLabel className="text-gray-300">Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={selectedPlan ? selectedPlan.minAmount : 50} 
                        max={selectedPlan ? selectedPlan.maxAmount : undefined}
                        step={0.01} 
                        {...field} 
                        className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 focus:border-[#FFD700]/60 focus:ring-[#FFD700]/20 transition-all duration-300"
                      />
                    </FormControl>
                    {selectedPlan && (
                      <p className="text-xs text-gray-400">
                        Amount must be between ${selectedPlan.minAmount} and ${selectedPlan.maxAmount}
                      </p>
                    )}
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-600"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Deposit Request'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 