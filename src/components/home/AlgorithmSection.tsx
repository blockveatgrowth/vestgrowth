"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";

export function AlgorithmSection() {
  return (
    <section className="relative py-16 bg-[#0D1117] border border-[#FFD700]/10 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#1C2128] opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 text-xs font-semibold text-[#FFD700] bg-[#FFD700]/10 rounded-full">
              INVESTMENT STRATEGY
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              How Our Multi-Tiered Plan System Works
            </h2>
            <p className="text-gray-400">
              We&apos;ve designed a flexible investment system with four plans to match your goals. Each tier offers increasing benefits based on your investment amount, from $50 up to $5,000.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </span>
                <span className="text-gray-300">
                  <span className="font-semibold text-[#FFD700]">Plan 1 ($50-199):</span> 2% direct commission with with premium referral earnings
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </span>
                <span className="text-gray-300">
                  <span className="font-semibold text-[#FFD700]">Plan 2 ($200-499):</span> 3% direct commission with  premium referral earnings
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </span>
                <span className="text-gray-300">
                  <span className="font-semibold text-[#FFD700]">Plan 3 ($500-1,499):</span> 3.5% direct commission with premium referral earnings
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </span>
                <span className="text-gray-300">
                  <span className="font-semibold text-[#FFD700]">Plan 4 ($1,500-5,000):</span> Maximum 4% direct commission with premium referral earnings
                </span>
              </li>
            </ul>
            <Button className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              Compare Plans in Detail
            </Button>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/trading.png"
              alt="Investment Tiers Visualization"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 