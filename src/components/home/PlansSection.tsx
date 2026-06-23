"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    _id: "plan1",
    name: "Starter",
    label: "Plan 1",
    badge: null,
    minAmount: 50,
    maxAmount: 199,
    profitCut: 40,
    support: "24/7 Support",
    features: [
      "40% of daily trade profit",
      "$50 – $199 investment range",
      "10% direct commission",
      "5-level referral rewards",
      "Real-time trade tracking",
      "24/7 Support",
    ],
  },
  {
    _id: "plan2",
    name: "Growth",
    label: "Plan 2",
    badge: "POPULAR",
    minAmount: 200,
    maxAmount: 499,
    profitCut: 50,
    support: "Priority Support",
    features: [
      "50% of daily trade profit",
      "$200 – $499 investment range",
      "10% direct commission",
      "5-level referral rewards",
      "Real-time trade tracking",
      "Priority Support",
    ],
  },
  {
    _id: "plan3",
    name: "Advanced",
    label: "Plan 3",
    badge: null,
    minAmount: 500,
    maxAmount: 1499,
    profitCut: 60,
    support: "VIP Support",
    features: [
      "60% of daily trade profit",
      "$500 – $1,499 investment range",
      "10% direct commission",
      "5-level referral rewards",
      "Real-time trade tracking",
      "VIP Support",
    ],
  },
  {
    _id: "plan4",
    name: "Elite",
    label: "Plan 4",
    badge: "BEST ROI",
    minAmount: 1500,
    maxAmount: 5000,
    profitCut: 75,
    support: "Dedicated Manager",
    features: [
      "75% of daily trade profit",
      "$1,500 – $5,000 investment range",
      "10% direct commission",
      "5-level referral rewards",
      "Real-time trade tracking",
      "Dedicated Account Manager",
    ],
  },
];

export function PlansSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden" id="plans">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD700]/3 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 mb-4">
            Investment Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFC200] to-[#FFA500] bg-clip-text text-transparent mb-4">
            Earn From Every Trade
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Your daily earnings are a percentage of the platform&apos;s live crypto trade result.
            The higher your plan, the larger your share of each day&apos;s profit.
          </p>
        </div>

        {/* How it works */}
        <div className="max-w-3xl mx-auto mb-14 p-5 rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/5 backdrop-blur animate-fade-in-up">
          <p className="text-center text-sm text-gray-300 leading-relaxed">
            <span className="text-[#FFD700] font-semibold">How it works: </span>
            Each day our algorithm executes a live crypto trade. If the trade yields{" "}
            <span className="text-[#FFD700]">+6%</span> and you are on the{" "}
            <span className="text-[#FFD700]">Growth plan (50% cut)</span>, you earn{" "}
            <span className="text-[#FFD700]">3%</span> of your invested balance that day.
            On a <span className="text-red-400">loss day</span>, no profit is deducted from your balance.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const isPopular = plan.badge === "POPULAR";
            const isElite = plan.badge === "BEST ROI";
            return (
              <div
                key={plan._id}
                className={`relative flex flex-col rounded-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up ${
                  index === 0 ? "" : index === 1 ? "delay-100" : index === 2 ? "delay-200" : "delay-300"
                } ${
                  isPopular
                    ? "border-2 border-[#FFD700] shadow-[0_0_40px_rgba(255,215,0,0.25)] bg-gradient-to-b from-[#1a1600]/90 to-[#0D1117]/90"
                    : isElite
                    ? "border-2 border-[#FFA500]/60 shadow-[0_0_30px_rgba(255,165,0,0.15)] bg-gradient-to-b from-[#1a0e00]/90 to-[#0D1117]/90"
                    : "border border-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.08)] bg-[#0D1117]/80"
                } backdrop-blur`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest ${
                      isPopular ? "bg-[#FFD700] text-black" : "bg-[#FFA500] text-black"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="p-7 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-5">{plan.label}</p>
                  {/* Hero stat: profit cut */}
                  <div className="text-center py-5 mb-5 rounded-xl bg-[#FFD700]/8 border border-[#FFD700]/15">
                    <div className="text-5xl font-extrabold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent leading-none">
                      {plan.profitCut}%
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5 tracking-wide">of daily trade profit</div>
                  </div>
                  {/* Investment range */}
                  <div className="flex items-center justify-between mb-5 px-1">
                    <span className="text-gray-400 text-sm">Investment</span>
                    <span className="text-white font-semibold text-sm">
                      ${plan.minAmount.toLocaleString()} – ${plan.maxAmount.toLocaleString()}
                    </span>
                  </div>
                  {/* Features */}
                  <ul className="space-y-3 mb-7 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/signup" className="mt-auto">
                    <Button className={`w-full font-semibold transition-all duration-300 ${
                      isPopular
                        ? "bg-[#FFD700] hover:bg-[#FFC200] text-black shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                        : isElite
                        ? "bg-[#FFA500] hover:bg-[#FF8C00] text-black"
                        : "bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                    }`}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-gray-500 text-sm mt-10 animate-fade-in-up">
          No fixed daily profit — earnings are tied to real market performance.{" "}
          <span className="text-[#FFD700]">Loss days do not deduct from your balance.</span>
        </p>
      </div>
    </section>
  );
}