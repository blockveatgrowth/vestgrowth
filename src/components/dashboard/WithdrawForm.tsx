"use client";

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Bank options data - static for now
const bankOptions = [
  { id: 'bank1', name: 'TRC20' },
  { id: 'bank2', name: 'ERC20' },
  { id: 'bank3', name: 'BEP20' },
];

const formSchema = z.object({
  bankType: z.string().min(1, 'Please select a bank type'),
  accountNumber: z.string().min(1, 'Wallet address is required'),
  amount: z.coerce.number().min(50, 'Minimum withdrawal amount is $50'),
  note: z.string().optional(),
});

export function WithdrawForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankType: '',
      accountNumber: '',
      amount: 50,
      note: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to submit withdrawal request');
        return;
      }

      toast.success('Withdrawal request submitted successfully');
      router.refresh();
      form.reset();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error('Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>
          Enter your wallet details to withdraw funds. Minimum withdrawal amount is $50.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bankType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
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
                        <SelectItem key={bank.id} value={bank.id} className="hover:bg-[#FFD700]/10 focus:bg-[#FFD700]/10">
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your wallet address" {...field} className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 focus:border-[#FFD700]/60 focus:ring-[#FFD700]/20 transition-all duration-300" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={50} 
                      step={0.01} 
                      {...field} 
                      className="border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 focus:border-[#FFD700]/60 focus:ring-[#FFD700]/20 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional information"
                      className="resize-none border-[#FFD700]/20 bg-[#0D1117] hover:border-[#FFD700]/40 focus:border-[#FFD700]/60 focus:ring-[#FFD700]/20 transition-all duration-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-600" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 