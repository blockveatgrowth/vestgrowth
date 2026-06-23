"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Choose Your Plan",
    description:
      "Select from 4 investment plans based on your budget — from $50 (Starter) to $5,000 (Elite). Higher plans earn a larger share of each day's trade profit.",
  },
  {
    number: "2",
    title: "Deposit & Activate",
    description:
      "Deposit via USDT (TRC20, ERC20, or BEP20). Once approved, your plan activates and you start receiving your share of every profitable trade day.",
  },
  {
    number: "3",
    title: "Earn Daily Profits",
    description:
      "Each day our algorithm trades live crypto markets. Your earnings (40–75% of the trade result × your balance) are credited automatically to your account.",
  },
  {
    number: "4",
    title: "Grow With Referrals",
    description:
      "Share your referral link and earn commissions across 5 levels of your network. Every deposit your referrals make earns you a direct 10% commission.",
  },
];

export function InvestmentJourneySection() {
  return (
    <section className="relative py-20 overflow-hidden" id="how-to-start">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD700]/3 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-4">
            Get Started
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Your Investment Journey
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Four simple steps to start earning from real crypto market movements every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative bg-[#161B22]/70 border border-[#FFD700]/15 rounded-2xl p-6 hover:border-[#FFD700]/40 hover:shadow-[0_0_20px_rgba(255,215,0,0.08)] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_12px_rgba(255,215,0,0.4)]">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 mt-1">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold px-10 py-6 text-base rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.35)] hover:shadow-[0_0_45px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-105">
              Create Free Account
            </Button>
          </Link>
          <p className="text-gray-600 text-xs mt-4">No hidden fees · Withdraw anytime · Real market data</p>
        </div>
      </div>
    </section>
  );
}
