"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const planDetails = [
  {
    label: "Starter — Plan 1",
    range: "$50 – $199",
    cut: "40%",
    highlight: "40% of each day's trade profit",
    commission: "10% direct referral commission",
  },
  {
    label: "Growth — Plan 2",
    range: "$200 – $499",
    cut: "50%",
    highlight: "50% of each day's trade profit",
    commission: "10% direct referral commission",
  },
  {
    label: "Advanced — Plan 3",
    range: "$500 – $1,499",
    cut: "60%",
    highlight: "60% of each day's trade profit",
    commission: "10% direct referral commission",
  },
  {
    label: "Elite — Plan 4",
    range: "$1,500 – $5,000",
    cut: "75%",
    highlight: "75% of each day's trade profit",
    commission: "10% direct referral commission + Dedicated Manager",
  },
];

export function AlgorithmSection() {
  return (
    <section className="relative py-20 overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] opacity-80 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: explanation */}
          <div className="space-y-6 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
              Investment Strategy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              How Your Daily Earnings Are{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Calculated
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Every day our algorithm executes a live crypto trade using real market data.
              Your daily profit is calculated as a <span className="text-[#FFD700] font-semibold">percentage of your balance</span>,
              determined by the trade result and your plan&apos;s profit-cut rate.
            </p>

            {/* Formula box */}
            <div className="p-5 rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/5 space-y-2">
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-3">Example Calculation</p>
              <div className="flex flex-col gap-1 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Your balance</span>
                  <span className="text-white font-semibold">$500</span>
                </div>
                <div className="flex justify-between">
                  <span>Today&apos;s trade result</span>
                  <span className="text-green-400 font-semibold">+6%</span>
                </div>
                <div className="flex justify-between">
                  <span>Your plan cut (Growth)</span>
                  <span className="text-[#FFD700] font-semibold">50%</span>
                </div>
                <div className="border-t border-[#FFD700]/20 pt-2 mt-1 flex justify-between text-base">
                  <span className="text-white font-semibold">Your daily earning</span>
                  <span className="text-[#FFD700] font-bold">$15 (3%)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 pt-1">Formula: Balance × (Trade% × Plan Cut%) / 100</p>
            </div>

            <p className="text-sm text-gray-500">
              On <span className="text-red-400 font-medium">loss days</span>, no deduction is made from your balance. You only earn — never lose your principal.
            </p>

            <Link href="/auth/signup">
              <Button className="bg-[#FFD700] text-black hover:bg-[#FFC200] font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300">
                Start Earning Today
              </Button>
            </Link>
          </div>

          {/* Right: plan comparison table */}
          <div className="space-y-4 animate-fade-in-up">
            <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-2">Plan Comparison</p>
            {planDetails.map((plan, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-[#FFD700]/15 bg-[#161B22]/60 hover:border-[#FFD700]/40 hover:bg-[#FFD700]/5 transition-all duration-200"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{plan.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{plan.range} · {plan.commission}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                    {plan.cut}
                  </div>
                  <div className="text-xs text-gray-500">profit share</div>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-600 text-center pt-2">
              All plans include 5-level referral rewards and real-time trade tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
