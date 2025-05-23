"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PlansSection() {
  // Static plan data based on planUtils.ts
  const plans = [
    {
      _id: "plan1",
      name: 'Plan 1',
      minAmount: 50,
      maxAmount: 199,
      directCommissionPercentage: 10,
      referralCommissions: {
        level1: 2,
        level2: 1,
        level3: 0.5,
        level4: 0.25,
        level5: 0.025,
      },
      dailyProfit: 2, // 2% daily profit
    },
    {
      _id: "plan2",
      name: 'Plan 2',
      minAmount: 200,
      maxAmount: 499,
      directCommissionPercentage: 10,
      referralCommissions: {
        level1: 3,
        level2: 1.5,
        level3: 0.75,
        level4: 0.375,
        level5: 0.025,
      },
      dailyProfit: 3, // 3% daily profit
    },
    {
      _id: "plan3",
      name: 'Plan 3',
      minAmount: 500,
      maxAmount: 1499,
      directCommissionPercentage: 10,
      referralCommissions: {
        level1: 3.5,
        level2: 1.75,
        level3: 0.875,
        level4: 0.4375,
        level5: 0.025,
      },
      dailyProfit: 3.5, // 3.5% daily profit
    },
    {
      _id: "plan4",
      name: 'Plan 4',
      minAmount: 1500,
      maxAmount: 5000,
      directCommissionPercentage: 10,
      referralCommissions: {
        level1: 4,
        level2: 2,
        level3: 1,
        level4: 0.5,
        level5: 0.025,
      },
      dailyProfit: 4, // 4% daily profit
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#0D1117]/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            Investment Plans
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Choose the investment plan that best suits your goals and start earning daily increments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan._id}
              className={`relative flex flex-col p-8 rounded-xl ${
                index === 1
                  ? "border-2 border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:shadow-[0_0_40px_rgba(255,215,0,0.3)]"
                  : "border border-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
              } bg-[#0D1117]/60 backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/60 transition-all duration-300 transform hover:scale-105 hover:border-[#FFD700]/40 animate-fade-in-up ${
                index === 0 ? "" : index === 1 ? "delay-100" : index === 2 ? "delay-200" : "delay-300"
              }`}
            >
              {index === 1 && (
                <div className="absolute top-5 right-5">
                  <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-white">${plan.minAmount}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-3xl font-bold text-white">${plan.maxAmount}</span>
                </div>
                <p className="text-gray-400 mt-2">Investment Range</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-[#FFD700] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {plan.dailyProfit}% Daily Profit
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-[#FFD700] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  30-Day Lock Period
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-[#FFD700] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  10% Welcome bonus
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-[#FFD700] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {index === 0 ? "24/7 Support" : index === 1 ? "Priority Support" : index >= 2 ? "VIP Support" : ""}
                </li>
              </ul>
              <Link href="/auth/signup" className="mt-auto">
                <Button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 