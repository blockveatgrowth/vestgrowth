"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Loader2, AlertCircle } from 'lucide-react';

const defaultBankOptions = [
  { id: 'bank1', name: 'TRC20 (USDT)', accountId: 'TCcDEhikqzaHpSp2HubiksS2tPm188PKUt' },
  { id: 'bank2', name: 'ERC20 (USDT/ETH)', accountId: '0x8282a8a8f68f12c8cc2a9592a6585878e71cb039' },
  { id: 'bank3', name: 'BEP20 (BSC)', accountId: '0x4b47b65b4d19249930e30d4a9c18751f9b3dc8f1' },
];

interface Plan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  directCommissionPercentage: number;
}

// Dynamic schema based on selected plan range
function buildSchema(min: number, max: number) {
  return z.object({
    bankId: z.string().min(1, 'Please select a network'),
    transactionId: z.string().min(1, 'Transaction ID is required'),
    amount: z.coerce
      .number()
      .min(min, `Minimum deposit for this plan is $${min}`)
      .max(max, `Maximum deposit for this plan is $${max}`),
    planId: z.string().min(1, 'Please select a plan'),
  });
}

export function DepositForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bankOptions, setBankOptions] = useState(defaultBankOptions);
  const [selectedBank, setSelectedBank] = useState<typeof defaultBankOptions[0] | null>(defaultBankOptions[0]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [withdrawalThreshold, setWithdrawalThreshold] = useState(50);

  const planMin = selectedPlan?.minAmount ?? 50;
  const planMax = selectedPlan?.maxAmount ?? 5000;

  const form = useForm<z.infer<ReturnType<typeof buildSchema>>>({
    resolver: zodResolver(buildSchema(planMin, planMax)),
    defaultValues: {
      bankId: 'bank1',
      transactionId: '',
      amount: 50,
      planId: '',
    },
  });

  // Re-validate amount whenever plan changes
  useEffect(() => {
    if (selectedPlan) {
      form.trigger('amount');
    }
  }, [selectedPlan, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, walletsRes] = await Promise.all([
          fetch('/api/plans'),
          fetch('/api/settings/wallets'),
        ]);
        if (plansRes.ok) {
          const data = await plansRes.json();
          setPlans(data.plans);
        }
        if (walletsRes.ok) {
          const walletData = await walletsRes.json();
          const updatedBanks = [
            { id: 'bank1', name: 'TRC20 (USDT)', accountId: walletData.wallets.trc20 },
            { id: 'bank2', name: 'ERC20 (USDT/ETH)', accountId: walletData.wallets.erc20 },
            { id: 'bank3', name: 'BEP20 (BSC)', accountId: walletData.wallets.bep20 },
          ];
          setBankOptions(updatedBanks);
          setSelectedBank(updatedBanks[0]);
          setWithdrawalThreshold(walletData.withdrawalThreshold || 50);
        }
      } catch {
        toast.error('Failed to load deposit options');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBankChange = (value: string) => {
    const bank = bankOptions.find(b => b.id === value);
    setSelectedBank(bank || null);
  };

  const handlePlanChange = (value: string) => {
    const plan = plans.find(p => p.id === value);
    setSelectedPlan(plan || null);
    if (plan) {
      form.setValue('amount', plan.minAmount);
      form.clearErrors('amount');
    }
  };

  async function onSubmit(values: z.infer<ReturnType<typeof buildSchema>>) {
    // Extra client-side guard
    if (selectedPlan) {
      if (values.amount < selectedPlan.minAmount || values.amount > selectedPlan.maxAmount) {
        form.setError('amount', {
          message: `Amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount} for ${selectedPlan.name}`,
        });
        return;
      }
    }
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit deposit request');
      }
      toast.success('Deposit request submitted! Awaiting admin approval.');
      router.refresh();
      form.reset();
      setSelectedBank(bankOptions[0]);
      setSelectedPlan(null);
    } catch (error: Error | unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to submit deposit request';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
        <span className="ml-2 text-gray-400">Loading deposit options...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl">
      <Card className="border border-[#FFD700]/20 bg-[#0D1117]/80 backdrop-blur shadow-[0_0_30px_rgba(255,215,0,0.1)] animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            Deposit Funds
          </CardTitle>
          <CardDescription className="text-gray-400">
            Select a plan, send your payment to the wallet address, then enter the transaction ID.
            Minimum withdrawal: <span className="text-[#FFD700]">${withdrawalThreshold}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Plan Selection — FIRST so amount range is known */}
              <FormField
                control={form.control}
                name="planId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Select Investment Plan</FormLabel>
                    <Select
                      onValueChange={(value) => { field.onChange(value); handlePlanChange(value); }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 transition-all">
                          <SelectValue placeholder="Choose a plan to see deposit range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0D1117] border-[#FFD700]/20">
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id} className="hover:bg-[#FFD700]/10 focus:bg-[#FFD700]/10">
                            {plan.name} — ${plan.minAmount} to ${plan.maxAmount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Plan Details Banner */}
              {selectedPlan && (
                <div className="p-4 border rounded-lg border-[#FFD700]/30 bg-[#FFD700]/5 animate-fade-in">
                  <p className="text-sm font-semibold mb-2 text-[#FFD700]">{selectedPlan.name} — Plan Details</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-400">Min Deposit: <span className="text-white font-semibold">${selectedPlan.minAmount}</span></p>
                    <p className="text-gray-400">Max Deposit: <span className="text-white font-semibold">${selectedPlan.maxAmount}</span></p>
                  </div>
                  <div className="mt-2 flex items-start gap-2 text-xs text-amber-400/80">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>Your deposit amount must be within this plan&apos;s range. Amounts outside this range will be rejected.</span>
                  </div>
                </div>
              )}

              {/* Network Selection */}
              <FormField
                control={form.control}
                name="bankId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Select Network</FormLabel>
                    <Select
                      onValueChange={(value) => { field.onChange(value); handleBankChange(value); }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 transition-all">
                          <SelectValue placeholder="Select a Network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0D1117] border-[#FFD700]/20">
                        {bankOptions.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id} className="hover:bg-[#FFD700]/10 focus:bg-[#FFD700]/10">
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Wallet Address Display */}
              {selectedBank && (
                <div className="p-4 border rounded-lg border-[#FFD700]/30 bg-[#FFD700]/5 animate-fade-in">
                  <p className="text-sm font-semibold mb-2 text-[#FFD700]">
                    Send to this {selectedBank.name} address:
                  </p>
                  <div className="flex items-center justify-between gap-2 bg-black/30 rounded-md p-3">
                    <p className="text-sm text-white font-mono break-all">{selectedBank.accountId}</p>
                    <CopyButton value={selectedBank.accountId} className="text-[#FFD700] hover:bg-[#FFD700]/10 shrink-0" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Send exact amount, then paste the transaction hash below.
                  </p>
                </div>
              )}

              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      Amount (USD)
                      {selectedPlan && (
                        <span className="ml-2 text-xs text-[#FFD700]/70">
                          ${selectedPlan.minAmount} – ${selectedPlan.maxAmount}
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={selectedPlan ? selectedPlan.minAmount : 50}
                        max={selectedPlan ? selectedPlan.maxAmount : 5000}
                        step={1}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Live validation feedback
                          if (selectedPlan) {
                            const val = parseFloat(e.target.value);
                            if (val < selectedPlan.minAmount) {
                              form.setError('amount', { message: `Minimum for ${selectedPlan.name} is $${selectedPlan.minAmount}` });
                            } else if (val > selectedPlan.maxAmount) {
                              form.setError('amount', { message: `Maximum for ${selectedPlan.name} is $${selectedPlan.maxAmount}` });
                            } else {
                              form.clearErrors('amount');
                            }
                          }
                        }}
                        className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 focus:border-[#FFD700]/60 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Transaction ID */}
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Transaction Hash / ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paste your transaction hash here"
                        {...field}
                        className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 focus:border-[#FFD700]/60 transition-all font-mono"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || !selectedPlan}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : 'Submit Deposit Request'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
