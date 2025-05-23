"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function InvestmentJourneySection() {
  return (
    <section className="relative bg-[#0D1117] border border-[#FFD700]/10 rounded-lg p-8">
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,215,0,0.1)] to-transparent" />
      
      <div className="max-w-4xl mx-auto relative">
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-8">
          Your Investment Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-[#161B22]/80 p-6 rounded-lg border border-[#FFD700]/20 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FFD700] text-black font-bold flex items-center justify-center">1</div>
            <h3 className="text-xl font-semibold text-white mb-3">Choose Your Plan</h3>
            <p className="text-gray-400 text-sm">
              Select from our 4 investment plans based on your budget and goals. Starting from just $50 up to $5,000 with increasing benefits.
            </p>
          </div>
          
          <div className="bg-[#161B22]/80 p-6 rounded-lg border border-[#FFD700]/20 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FFD700] text-black font-bold flex items-center justify-center">2</div>
            <h3 className="text-xl font-semibold text-white mb-3">Make Your Deposit</h3>
            <p className="text-gray-400 text-sm">
              Complete your deposit and start earning 10% daily increments plus direct commissions from 2-4% depending on your plan tier.
            </p>
          </div>
          
          <div className="bg-[#161B22]/80 p-6 rounded-lg border border-[#FFD700]/20 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#FFD700] text-black font-bold flex items-center justify-center">3</div>
            <h3 className="text-xl font-semibold text-white mb-3">Grow Your Network</h3>
            <p className="text-gray-400 text-sm">
              Share your referral link and earn commissions 5 levels deep. Higher plans offer increased commission rates at every level.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/auth/signup">
            <Button className="sm:w-auto bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold px-6 sm:px-8 py-6 text-md md:text-lg shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 